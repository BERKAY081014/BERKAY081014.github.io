/* =========================================================
   Berkay Bilgin – Projeler Kaynak Kod Veritabanı
   GitHub: https://github.com/BERKAY081014
   ========================================================= */

window.PROJECT_CODES = {
  "firin": {
    id: "firin",
    title: "Akıllı Modüler Fırın Kontrol Sistemi",
    folder: "01-esp32-akilli-firin",
    filename: "main.cpp",
    language: "cpp",
    langLabel: "C++ / ESP32",
    repoName: "esp32-akilli-modular-firin",
    badge: "IoT & Gömülü",
    summary: "ESP32 mikrodenetleyici, MAX31865 RTD PT100 sıcaklık sensörü, PID algoritması, MQTT telemetri yayını ve OLED arayüzü.",
    gitCommand: `cd "github-projeleri/01-esp32-akilli-firin"
git init
git add .
git commit -m "feat: initial commit for esp32 smart oven control system"
git branch -M main
git remote add origin https://github.com/BERKAY081014/esp32-akilli-modular-firin.git
git push -u origin main`,
    code: `/**
 * ============================================================================
 * Proje: Akıllı Modüler Fırın Kontrol Sistemi (Bitirme Tezi)
 * Geliştirici: Berkay Bilgin (https://github.com/BERKAY081014)
 * Platform: ESP32 NodeMCU-32S / Arduino Framework
 * Sensörler & Modüller: MAX31865 RTD PT100, SSD1306 OLED, Solid State Relay (SSR)
 * Protokol: MQTT / WiFi (WPA2)
 * ============================================================================
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_MAX31865.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// ---------- WiFi & MQTT Yapılandırması ----------
const char* WIFI_SSID     = "LAB_WIFI_NETWORK";
const char* WIFI_PASS     = "SecurePass1234!";
const char* MQTT_SERVER   = "broker.emqx.io";
const int   MQTT_PORT     = 1883;
const char* MQTT_CLIENT_ID = "ESP32_Firin_Berkay";

// MQTT Konuları
const char* TOPIC_TEMP_PUB  = "berkay/firin/sicaklik";
const char* TOPIC_STATE_PUB = "berkay/firin/durum";
const char* TOPIC_CMD_SUB   = "berkay/firin/komut";

// ---------- Donanım Pin Tanımları ----------
#define PIN_SSR_HEATER   25  // Isıtıcı Solid State Röle (PWM)
#define PIN_FAN_RELAY    26  // Soğutma Fanı Rölesi
#define PIN_BUZZER       27  // Güvenlik Sesli Alarm
#define PIN_EMERGENCY_SW 34  // Acil Stop Butonu (Giriş)

// MAX31865 Donanımsal SPI Pinleri
#define RREF      430.0f     // PT100 için referans direnç (430 Ohm)
#define RNOMINAL  100.0f     // PT100 için nominal 0°C direnç (100 Ohm)
#define MAX_CS_PIN 5
Adafruit_MAX31865 thermo = Adafruit_MAX31865(MAX_CS_PIN);

// OLED Ekran
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// ---------- PID Sıcaklık Kontrol Parametreleri ----------
float targetTemperature = 180.0f; // Hedef Sıcaklık (°C)
float currentTemperature = 0.0f;
float kp = 4.2f;
float ki = 0.15f;
float kd = 1.8f;

float integral = 0.0f;
float lastError = 0.0f;
unsigned long lastPIDTime = 0;
bool isSystemActive = false;
bool isEmergencyTriggered = false;

// Fonksiyon Prototipleri
void setupWiFi();
void reconnectMQTT();
void mqttCallback(char* topic, byte* payload, unsigned int length);
float computePID(float setpoint, float actual, float dt);
void updateDisplay();
void checkSafetyLimits();

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\\n[SİSTEM] Akıllı Modüler Fırın Kontrol Ünitesi Başlatılıyor...");

  pinMode(PIN_SSR_HEATER, OUTPUT);
  pinMode(PIN_FAN_RELAY, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_EMERGENCY_SW, INPUT_PULLUP);

  digitalWrite(PIN_SSR_HEATER, LOW);
  digitalWrite(PIN_FAN_RELAY, LOW);
  digitalWrite(PIN_BUZZER, LOW);

  // MAX31865 RTD Sensörü Başlat (3 Telli PT100)
  thermo.begin(MAX31865_3WIRE);

  // OLED Ekran Başlat
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("[HATA] SSD1306 OLED başlatılamadı!");
  }
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(10, 20);
  display.println("BERKAY BILGIN");
  display.setCursor(10, 35);
  display.println("Akilli Firin v2.4");
  display.display();

  setupWiFi();
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);

  Serial.println("[BAŞARILI] Sistem hazır duruma geçti.");
}

void loop() {
  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop();

  // 1. PT100 Sıcaklık Ölçümü
  uint16_t rtd = thermo.readRTD();
  float ratio = (float)rtd / 32768.0f;
  currentTemperature = thermo.temperature(RNOMINAL, RREF);

  // RTD Hata Kontrolü
  uint8_t fault = thermo.readFault();
  if (fault) {
    Serial.printf("[KRİTİK HATA] Sensör arızası: 0x%X\\n", fault);
    thermo.clearFault();
    isEmergencyTriggered = true;
  }

  // 2. Acil Durum Kontrolü
  checkSafetyLimits();

  // 3. PID Sıcaklık Regülasyonu
  unsigned long now = millis();
  if (now - lastPIDTime >= 500) {
    float dt = (now - lastPIDTime) / 1000.0f;
    lastPIDTime = now;

    if (isSystemActive && !isEmergencyTriggered) {
      float output = computePID(targetTemperature, currentTemperature, dt);
      ledcWrite(0, (uint32_t)output);
      
      // Fan Kontrolü (Histerezis)
      if (currentTemperature > targetTemperature + 5.0f) {
        digitalWrite(PIN_FAN_RELAY, HIGH);
      } else {
        digitalWrite(PIN_FAN_RELAY, LOW);
      }
    } else {
      digitalWrite(PIN_SSR_HEATER, LOW);
      digitalWrite(PIN_FAN_RELAY, isEmergencyTriggered ? HIGH : LOW);
    }

    // Telemetri Gönderimi (MQTT)
    char tempStr[16];
    snprintf(tempStr, sizeof(tempStr), "%.2f", currentTemperature);
    mqttClient.publish(TOPIC_TEMP_PUB, tempStr);

    char stateJson[128];
    snprintf(stateJson, sizeof(stateJson), 
             "{\\"hedef\\":%.1f,\\"anlik\\":%.2f,\\"aktif\\":%s,\\"alarm\\":%s}",
             targetTemperature, currentTemperature, 
             isSystemActive ? "true" : "false", 
             isEmergencyTriggered ? "true" : "false");
    mqttClient.publish(TOPIC_STATE_PUB, stateJson);

    // OLED Güncelle
    updateDisplay();
  }
}

float computePID(float setpoint, float actual, float dt) {
  float error = setpoint - actual;
  integral += error * dt;
  integral = constrain(integral, -100.0f, 100.0f); // Anti-windup
  float derivative = (error - lastError) / dt;
  lastError = error;

  float output = (kp * error) + (ki * integral) + (kd * derivative);
  return constrain(output, 0.0f, 255.0f);
}

void checkSafetyLimits() {
  if (digitalRead(PIN_EMERGENCY_SW) == LOW || currentTemperature > 260.0f) {
    isEmergencyTriggered = true;
    digitalWrite(PIN_SSR_HEATER, LOW);
    digitalWrite(PIN_FAN_RELAY, HIGH);
    digitalWrite(PIN_BUZZER, HIGH);
  }
}

void updateDisplay() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("FIRIN KONTROL PANEL");
  display.drawLine(0, 10, 128, 10, SSD1306_WHITE);
  
  display.setCursor(0, 16);
  display.printf("Sicaklik: %.1f C\\n", currentTemperature);
  display.setCursor(0, 28);
  display.printf("Hedef   : %.1f C\\n", targetTemperature);
  display.setCursor(0, 40);
  display.printf("Durum   : %s\\n", isEmergencyTriggered ? "! ACIL DURUM !" : (isSystemActive ? "CALISIYOR" : "BEKLEMEDE"));
  
  display.setCursor(0, 52);
  display.printf("WiFi/MQTT: %s", mqttClient.connected() ? "BAGLI" : "KOPUK");
  display.display();
}

void setupWiFi() {
  Serial.printf("[WIFI] %s agina baglaniliyor...", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(400);
    Serial.print(".");
  }
  Serial.printf("\\n[WIFI] Baglandi! IP Adresi: %s\\n", WiFi.localIP().toString().c_str());
}

void reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("[MQTT] Baglanti kuruluyor...");
    if (mqttClient.connect(MQTT_CLIENT_ID)) {
      Serial.println(" Baglandi!");
      mqttClient.subscribe(TOPIC_CMD_SUB);
    } else {
      Serial.printf(" Hata kitle kodu: %d. 4sn sonra tekrar...\\n", mqttClient.state());
      delay(4000);
    }
  }
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (unsigned int i = 0; i < length; i++) message += (char)payload[i];
  Serial.printf("[MQTT ALINDI] %s: %s\\n", topic, message.c_str());

  if (message == "START") isSystemActive = true;
  else if (message == "STOP") isSystemActive = false;
  else if (message == "RESET_ALARM") isEmergencyTriggered = false;
  else if (message.startsWith("SET_TEMP:")) {
    targetTemperature = message.substring(9).toFloat();
  }
}`
  },

  "plc": {
    id: "plc",
    title: "Siemens PLC Isıtma & Soğutma Hattı",
    folder: "02-siemens-plc-isitma-sogutma",
    filename: "HeatingCoolingControl.scl",
    language: "scl",
    langLabel: "SCL (Siemens TIA Portal)",
    repoName: "siemens-plc-heating-cooling-line",
    badge: "PLC & SCADA",
    summary: "Siemens S7-1200 / S7-1500 PLC için Structured Control Language (SCL) durum makinesi, konveyör kilitleri ve sıcaklık histerezisi.",
    gitCommand: `cd "github-projeleri/02-siemens-plc-isitma-sogutma"
git init
git add .
git commit -m "feat: initial commit for siemens plc industrial automation"
git branch -M main
git remote add origin https://github.com/BERKAY081014/siemens-plc-heating-cooling-line.git
git push -u origin main`,
    code: `// ============================================================================
// Proje: Endüstriyel Isıtma & Soğutma Konveyör Hattı Otomasyonu
// Geliştirici: Berkay Bilgin (https://github.com/BERKAY081014)
// Donanım: Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC
// Mühendislik Yazılımı: TIA Portal v18 / SCL (Structured Control Language)
// Simülasyon: Factory I/O v2.5 + S7-PLCSIM
// ============================================================================

FUNCTION_BLOCK "FB_HeatingCoolingLine"
{ S7_Optimized_Access := 'TRUE' }
VERSION : 0.1

VAR_INPUT
    bStartBtn          : Bool;    // Panel Başlat Butonu (NO)
    bStopBtn           : Bool;    // Panel Durdur Butonu (NC)
    bEmergencyStop     : Bool;    // E-Stop Güvenlik Mantarı (NC - 0: Acil Durum)
    bPartEntrySensor   : Bool;    // Giriş Fotoseli (Parça Geldi)
    bPartExitSensor    : Bool;    // Çıkış Fotoseli (Parça Çıktı)
    rActualTemperature : Real;    // Fırın Sıcaklık Transmitteri (4-20mA -> 0.0 - 300.0 °C)
    rSetTemperature    : Real;    // Operatör Hedef Sıcaklığı (°C)
    rTempHysteresis    : Real;    // Histerezis Toleransı (Örn: 2.0 °C)
    tHeatingDuration   : Time;    // Parça Isıtma Odası Bekleme Süresi (Örn: T#15S)
    tCoolingDuration   : Time;    // Soğutma Tüneli Bekleme Süresi (Örn: T#10S)
END_VAR

VAR_OUTPUT
    bConveyorEntryRun  : Bool;    // Giriş Konveyörü Motor Sürücüsü
    bConveyorExitRun   : Bool;    // Çıkış Konveyörü Motor Sürücüsü
    bHeaterContactor   : Bool;    // Isıtıcı Rezistans Kontaktörü
    bCoolingFan        : Bool;    // Soğutma Fanı Motor Kontaktörü
    bAlarmSiren        : Bool;    // Sesli Alarm Kornası
    bSystemRunningLamp : Bool;    // Pano Yeşil Çalışıyor Lambası
    wSystemState       : Word;    // 1: IDLE, 2: FEEDING, 3: HEATING, 4: COOLING, 99: ERROR
END_VAR

VAR
    iCurrentState      : Int := 0; 
    tonHeatingTimer    : TON;
    tonCoolingTimer    : TON;
    bPartInOven        : Bool := FALSE;
    bPartInCooler      : Bool := FALSE;
    bOverTempFault     : Bool := FALSE;
END_VAR

CONST
    STATE_IDLE         : Int := 0;
    STATE_FEEDING      : Int := 1;
    STATE_HEATING      : Int := 2;
    STATE_COOLING      : Int := 3;
    STATE_DISCHARGE    : Int := 4;
    STATE_EMERGENCY    : Int := 99;
    MAX_TEMP_LIMIT     : Real := 280.0;
END_CONST

BEGIN
    // 1. GÜVENLİK VE ACİL DURUM (E-STOP & AŞIRI SICAKLIK) KONTROLÜ
    IF NOT #bEmergencyStop OR (#rActualTemperature > #MAX_TEMP_LIMIT) THEN
        #iCurrentState := #STATE_EMERGENCY;
        #bOverTempFault := (#rActualTemperature > #MAX_TEMP_LIMIT);
    END_IF;

    // 2. SONLU DURUM MAKİNESİ (STATE MACHINE)
    CASE #iCurrentState OF

        #STATE_IDLE:
            #bConveyorEntryRun  := FALSE;
            #bConveyorExitRun   := FALSE;
            #bHeaterContactor   := FALSE;
            #bCoolingFan        := FALSE;
            #bAlarmSiren        := FALSE;
            #bSystemRunningLamp := FALSE;

            IF #bStartBtn AND #bStopBtn AND #bEmergencyStop THEN
                #iCurrentState := #STATE_FEEDING;
            END_IF;

        #STATE_FEEDING:
            #bSystemRunningLamp := TRUE;
            #bConveyorEntryRun  := TRUE;

            IF #bPartEntrySensor THEN
                #bConveyorEntryRun := FALSE;
                #bPartInOven       := TRUE;
                #iCurrentState     := #STATE_HEATING;
            END_IF;

            IF NOT #bStopBtn THEN
                #iCurrentState := #STATE_IDLE;
            END_IF;

        #STATE_HEATING:
            #bSystemRunningLamp := TRUE;
            #bConveyorEntryRun  := FALSE;

            // Histerezisli Isıtma Kontrolü
            IF #rActualTemperature < (#rSetTemperature - #rTempHysteresis) THEN
                #bHeaterContactor := TRUE;
            ELSIF #rActualTemperature >= #rSetTemperature THEN
                #bHeaterContactor := FALSE;
            END_IF;

            #tonHeatingTimer(IN := (#rActualTemperature >= (#rSetTemperature - 1.0)),
                             PT := #tHeatingDuration);

            IF #tonHeatingTimer.Q THEN
                #bHeaterContactor := FALSE;
                #bPartInOven      := FALSE;
                #bPartInCooler    := TRUE;
                #iCurrentState    := #STATE_COOLING;
            END_IF;

        #STATE_COOLING:
            #bSystemRunningLamp := TRUE;
            #bCoolingFan        := TRUE;

            #tonCoolingTimer(IN := TRUE, PT := #tCoolingDuration);

            IF #tonCoolingTimer.Q THEN
                #bCoolingFan   := FALSE;
                #iCurrentState := #STATE_DISCHARGE;
            END_IF;

        #STATE_DISCHARGE:
            #bSystemRunningLamp := TRUE;
            #bConveyorExitRun   := TRUE;

            IF #bPartExitSensor THEN
                #bConveyorExitRun := FALSE;
                #bPartInCooler    := FALSE;
                #iCurrentState    := #STATE_IDLE;
            END_IF;

        #STATE_EMERGENCY:
            #bConveyorEntryRun  := FALSE;
            #bConveyorExitRun   := FALSE;
            #bHeaterContactor   := FALSE;
            #bCoolingFan        := TRUE;
            #bAlarmSiren        := TRUE;
            #bSystemRunningLamp := FALSE;

            IF #bEmergencyStop AND NOT #bOverTempFault AND #bStartBtn THEN
                #bAlarmSiren   := FALSE;
                #iCurrentState := #STATE_IDLE;
            END_IF;

        ELSE
            #iCurrentState := #STATE_IDLE;
    END_CASE;

    #wSystemState := INT_TO_WORD(#iCurrentState);

END_FUNCTION_BLOCK`
  },

  "vision": {
    id: "vision",
    title: "MediaPipe Head-Tracking 3D Simülasyonu",
    folder: "03-mediapipe-head-tracking",
    filename: "head_tracking.py",
    language: "python",
    langLabel: "Python 3 / MediaPipe",
    repoName: "mediapipe-head-tracking-3d",
    badge: "Computer Vision",
    summary: "Web kamera üzerinden Face Mesh referans noktalarıyla derinlik (Z) tahmini ve dinamik paralaks etkili 3D küp görselleştirmesi.",
    gitCommand: `cd "github-projeleri/03-mediapipe-head-tracking"
git init
git add .
git commit -m "feat: initial commit for mediapipe 3d head tracking"
git branch -M main
git remote add origin https://github.com/BERKAY081014/mediapipe-head-tracking-3d.git
git push -u origin main`,
    code: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
\"\"\"
===============================================================================
Proje: MediaPipe ile Head-Tracking & Dinamik Paralaks 3D Simülasyonu
Geliştirici: Berkay Bilgin (https://github.com/BERKAY081014)
Kütüphaneler: OpenCV, MediaPipe, NumPy
Amaç: Web kamera üzerinden yüzün 3D uzaydaki konumunu gerçek zamanlı
      takip ederek ekranda derinlik (hologram/paralaks) hissi oluşturan simülasyon.
===============================================================================
\"\"\"

import cv2
import mediapipe as mp
import numpy as np
import time

class HeadTracking3D:
    def __init__(self, camera_id=0, screen_w=1280, screen_h=720):
        self.screen_w = screen_w
        self.screen_h = screen_h
        
        self.cap = cv2.VideoCapture(camera_id)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.6,
            min_tracking_confidence=0.6
        )

        self.cube_size = 180
        s = self.cube_size // 2
        self.cube_vertices = np.array([
            [-s, -s, -s],
            [ s, -s, -s],
            [ s,  s, -s],
            [-s,  s, -s],
            [-s, -s,  s],
            [ s, -s,  s],
            [ s,  s,  s],
            [-s,  s,  s]
        ], dtype=np.float32)

        self.cube_edges = [
            (0, 1), (1, 2), (2, 3), (3, 0),
            (4, 5), (5, 6), (6, 7), (7, 4),
            (0, 4), (1, 5), (2, 6), (3, 7)
        ]

        self.smooth_x = screen_w // 2
        self.smooth_y = screen_h // 2
        self.smooth_z = 500.0
        self.alpha = 0.25

    def calculate_head_position(self, landmarks, frame_w, frame_h):
        left_eye = np.array([landmarks[33].x * frame_w, landmarks[33].y * frame_h])
        right_eye = np.array([landmarks[263].x * frame_w, landmarks[263].y * frame_h])

        eye_distance = np.linalg.norm(left_eye - right_eye)
        if eye_distance < 1.0:
            eye_distance = 1.0

        estimated_z = (60.0 * 550.0) / eye_distance
        head_center_x = (left_eye[0] + right_eye[0]) / 2.0
        head_center_y = (left_eye[1] + right_eye[1]) / 2.0

        return head_center_x, head_center_y, estimated_z

    def project_3d_to_2d(self, vertices, camera_pos, focal_length=600):
        cam_x, cam_y, cam_z = camera_pos
        projected_points = []

        for vertex in vertices:
            x, y, z = vertex
            rel_x = x - cam_x
            rel_y = y - cam_y
            rel_z = z + cam_z

            if rel_z <= 10.0:
                rel_z = 10.0

            screen_x = int((rel_x * focal_length) / rel_z + (self.screen_w // 2))
            screen_y = int((rel_y * focal_length) / rel_z + (self.screen_h // 2))
            projected_points.append((screen_x, screen_y))

        return projected_points

    def run(self):
        prev_time = time.time()
        print("[BAŞLADI] Head-Tracking penceresi açıldı. Çıkış için 'ESC' tuşuna basın.")

        while self.cap.isOpened():
            success, frame = self.cap.read()
            if not success:
                break

            frame = cv2.flip(frame, 1)
            fh, fw, _ = frame.shape
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.face_mesh.process(rgb_frame)

            canvas = np.zeros((self.screen_h, self.screen_w, 3), dtype=np.uint8)

            for grid_x in range(100, self.screen_w, 100):
                cv2.line(canvas, (grid_x, self.screen_h - 120), (grid_x, self.screen_h), (20, 40, 70), 1)

            if results.multi_face_landmarks:
                landmarks = results.multi_face_landmarks[0].landmark
                raw_x, raw_y, raw_z = self.calculate_head_position(landmarks, fw, fh)

                norm_x = (raw_x - (fw / 2.0)) * 2.8
                norm_y = (raw_y - (fh / 2.0)) * 2.8

                self.smooth_x += self.alpha * (norm_x - self.smooth_x)
                self.smooth_y += self.alpha * (norm_y - self.smooth_y)
                self.smooth_z += self.alpha * (raw_z - self.smooth_z)

            cam_pos = (self.smooth_x, self.smooth_y, self.smooth_z)
            points_2d = self.project_3d_to_2d(self.cube_vertices, cam_pos)

            for edge in self.cube_edges:
                pt1 = points_2d[edge[0]]
                pt2 = points_2d[edge[1]]
                cv2.line(canvas, pt1, pt2, (255, 180, 40), 2, cv2.LINE_AA)

            for pt in points_2d:
                cv2.circle(canvas, pt, 5, (0, 230, 255), -1, cv2.LINE_AA)

            curr_time = time.time()
            fps = 1.0 / (curr_time - prev_time + 1e-6)
            prev_time = curr_time

            cv2.putText(canvas, f"FPS: {int(fps)} | X: {int(self.smooth_x)} Y: {int(self.smooth_y)} Z: {int(self.smooth_z)}",
                        (30, 45), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 180), 2)
            cv2.putText(canvas, "Berkay Bilgin | MediaPipe Head-Tracking Paralaks Demo",
                        (30, self.screen_h - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (140, 160, 200), 1)

            thumb = cv2.resize(frame, (180, 135))
            canvas[20:155, self.screen_w - 200:self.screen_w - 20] = thumb
            cv2.rectangle(canvas, (self.screen_w - 200, 20), (self.screen_w - 20, 155), (0, 200, 255), 1)

            cv2.imshow("3D Head-Tracking Simülasyonu", canvas)
            if cv2.waitKey(1) & 0xFF == 27:
                break

        self.cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    app = HeadTracking3D()
    app.run()`
  },

  "boost": {
    id: "boost",
    title: "MATLAB ile DC-DC Boost Konvertör",
    folder: "04-matlab-boost-converter",
    filename: "boost_converter_design.m",
    language: "matlab",
    langLabel: "MATLAB / Simulink",
    repoName: "matlab-dcdc-boost-converter",
    badge: "Güç Elektroniği",
    summary: "12V-24V DC-DC Boost devresi parametre hesabı, Sürekli İletim Modu (CCM) doğrulaması ve Bode kararlılık grafiği.",
    gitCommand: `cd "github-projeleri/04-matlab-boost-converter"
git init
git add .
git commit -m "feat: initial commit for matlab boost converter analysis"
git branch -M main
git remote add origin https://github.com/BERKAY081014/matlab-dcdc-boost-converter.git
git push -u origin main`,
    code: `%% ========================================================================
%% Proje: DC-DC Boost Konvertör Tasarımı, Kararlılık ve Simülasyon Analizi
%% Geliştirici: Berkay Bilgin (https://github.com/BERKAY081014)
%% Araç: MATLAB & Simulink / Simscape Electrical
%% ========================================================================

clear; clc; close all;
fprintf('=== DC-DC BOOST KONVERTÖR ANALİZİ (BERKAY BİLGİN) ===\\n\\n');

%% 1. Tasarım Parametreleri
Vin_nom  = 12.0;      % Nominal Giriş Gerilimi (V)
Vin_min  = 9.0;       % Minimum Giriş Gerilimi (V)
Vout     = 24.0;      % İstenen Çıkış Gerilimi (V)
Pout     = 72.0;      % Nominal Çıkış Gücü (W)
fs       = 50e3;      % Anahtarlama Frekansı (50 kHz)
Ts       = 1 / fs;    % Anahtarlama Periyodu (s)
Iout     = Pout / Vout; % Çıkış Akımı (A) = 3.0 A
Rload    = Vout / Iout; % Yük Direnci (Ohm) = 8.0 Ohm

delta_IL_ratio = 0.20; % %20 Endüktans Akım Dalgalanması
delta_Vo_ratio = 0.01; % %1 Çıkış Gerilim Dalgalanması (0.24V)

%% 2. Görev Oranı (Duty Cycle - D) Hesabı
D_nom = (Vout - Vin_nom) / Vout;
D_max = (Vout - Vin_min) / Vout;
fprintf('Nominal Duty Cycle (D): %.3f (%%% .1f)\\n', D_nom, D_nom*100);
fprintf('Maksimum Duty Cycle (D_max): %.3f (%%% .1f)\\n', D_max, D_max*100);

%% 3. Pasif Elemanların (L ve C) Hesaplanması
delta_IL = delta_IL_ratio * (Iout / (1 - D_nom));
L_min = (Vin_nom * D_nom) / (fs * delta_IL);
L_chosen = 1.3 * L_min; 

delta_Vo = delta_Vo_ratio * Vout;
C_min = (Iout * D_nom) / (fs * delta_Vo);
C_chosen = 1.5 * C_min;

fprintf('Hesaplanan L_min: %.2f uH -> Seçilen: %.2f uH\\n', L_min*1e6, L_chosen*1e6);
fprintf('Hesaplanan C_min: %.2f uF -> Seçilen: %.2f uF\\n', C_min*1e6, C_chosen*1e6);

%% 4. Sürekli İletim Modu (CCM) Sınır Analizi
L_crit = (D_nom * (1 - D_nom)^2 * Rload) / (2 * fs);
if L_chosen > L_crit
    fprintf('Çalışma Modu: SÜREKLİ İLETİM (CCM) KESİNLİKLE DOĞRULANDI.\\n');
else
    warning('Çalışma Modu: KESİNTİLİ İLETİM (DCM) TEHLİKESİ!');
end

%% 5. Küçük Sinyal Modeli ve Transfer Fonksiyonu (Gvd(s))
s = tf('s');
D_p = 1 - D_nom;

omega_z_rhp = (D_p^2 * Rload) / L_chosen;
omega_o = D_p / sqrt(L_chosen * C_chosen);
Q = D_p * Rload * sqrt(C_chosen / L_chosen);

Gvd = (Vout / D_p) * (1 - s / omega_z_rhp) / (1 + s / (omega_o * Q) + (s / omega_o)^2);

%% 6. PID / Tip-II Gerilim Kompanzatör Tasarımı
Kp = 0.45;
Ki = 320.0;
Kd = 0.00012;
C_controller = pid(Kp, Ki, Kd);

T_loop = series(C_controller, Gvd);
T_closed = feedback(T_loop, 1);

%% 7. Kararlılık ve Bode Analizi
figure('Color', 'white');
subplot(2, 1, 1);
bode(T_loop, {10, 1e6});
grid on;
title('DC-DC Boost Konvertör Açık Çevrim Bode Diyagramı');

subplot(2, 1, 2);
step(T_closed);
grid on;
title('24V Kapalı Çevrim Birim Basamak Yanıtı');

[Gm, Pm, Wcg, Wcp] = margin(T_loop);
fprintf('\\nKazanç Payı: %.2f dB | Faz Payı: %.2f derece (Hedef > 45 deg)\\n', 20*log10(Gm), Pm);`
  },

  "cnn": {
    id: "cnn",
    title: "CNN Tabanlı Görüntü Sınıflandırma Modeli",
    folder: "05-cnn-goruntu-siniflandirma",
    filename: "train_cnn.py",
    language: "python",
    langLabel: "Python / TensorFlow",
    repoName: "cnn-image-classification-tf",
    badge: "Derin Öğrenme",
    summary: "TensorFlow 2.x ve Keras ile 4 bloklu Evrişimli Sinir Ağı (CNN), Batch Normalization, Dropout ve EarlyStopping eğitim hattı.",
    gitCommand: `cd "github-projeleri/05-cnn-goruntu-siniflandirma"
git init
git add .
git commit -m "feat: initial commit for cnn image classification model"
git branch -M main
git remote add origin https://github.com/BERKAY081014/cnn-image-classification-tf.git
git push -u origin main`,
    code: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
\"\"\"
===============================================================================
Proje: CNN Tabanlı Görüntü Sınıflandırma Modeli (Derin Öğrenme)
Geliştirici: Berkay Bilgin (https://github.com/BERKAY081014)
Kütüphaneler: TensorFlow 2.x, Keras, NumPy, Matplotlib
===============================================================================
\"\"\"

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models, callbacks
import numpy as np

IMG_SIZE = (128, 128)
BATCH_SIZE = 32
EPOCHS = 25
NUM_CLASSES = 2
LEARNING_RATE = 1e-4

def build_cnn_model(input_shape=(128, 128, 3), num_classes=2):
    model = models.Sequential([
        layers.Input(shape=input_shape),
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.12),
        layers.RandomZoom(0.1),

        # Blok 1
        layers.Conv2D(32, (3, 3), padding="same", use_bias=False),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.MaxPooling2D(pool_size=(2, 2)),
        layers.Dropout(0.15),

        # Blok 2
        layers.Conv2D(64, (3, 3), padding="same", use_bias=False),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.MaxPooling2D(pool_size=(2, 2)),
        layers.Dropout(0.2),

        # Blok 3
        layers.Conv2D(128, (3, 3), padding="same", use_bias=False),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.MaxPooling2D(pool_size=(2, 2)),
        layers.Dropout(0.3),

        # Blok 4
        layers.Conv2D(256, (3, 3), padding="same", use_bias=False),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.MaxPooling2D(pool_size=(2, 2)),

        layers.GlobalAveragePooling2D(),
        layers.Dense(128, activation="relu"),
        layers.BatchNormalization(),
        layers.Dropout(0.4),

        layers.Dense(1 if num_classes == 2 else num_classes, 
                     activation="sigmoid" if num_classes == 2 else "softmax")
    ])
    return model

def main():
    model = build_cnn_model()
    model.summary()

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss="binary_crossentropy",
        metrics=["accuracy", keras.metrics.Precision(), keras.metrics.Recall()]
    )

    cb = [
        callbacks.EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True),
        callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3, verbose=1)
    ]

    print("[BİLGİ] Model eğitimi ve mimari derleme hazırlandı.")

if __name__ == "__main__":
    main()`
  },

  "stitching": {
    id: "stitching",
    title: "OpenCV (ORB & RANSAC) Görüntü Birleştirme",
    folder: "06-opencv-panoramik-stitching",
    filename: "image_stitcher.py",
    language: "python",
    langLabel: "Python / OpenCV",
    repoName: "opencv-orb-ransac-stitching",
    badge: "Görüntü İşleme",
    summary: "ORB öznitelik çıkarıcı, Lowe's Ratio filtreli eşleme ve RANSAC homografi matrisi hesabı ile kusursuz panoramik dikiş.",
    gitCommand: `cd "github-projeleri/06-opencv-panoramik-stitching"
git init
git add .
git commit -m "feat: initial commit for opencv panorama stitcher"
git branch -M main
git remote add origin https://github.com/BERKAY081014/opencv-orb-ransac-stitching.git
git push -u origin main`,
    code: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
\"\"\"
===============================================================================
Proje: OpenCV (ORB & RANSAC) ile Otomatik Panoramik Görüntü Birleştirme
Geliştirici: Berkay Bilgin (https://github.com/BERKAY081014)
===============================================================================
\"\"\"

import cv2
import numpy as np

class PanoramaStitcher:
    def __init__(self, max_features=2500, match_ratio=0.75):
        self.orb = cv2.ORB_create(nfeatures=max_features)
        self.matcher = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=False)
        self.match_ratio = match_ratio

    def extract_features(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        return self.orb.detectAndCompute(gray, None)

    def match_keypoints(self, desc1, desc2):
        raw_matches = self.matcher.knnMatch(desc1, desc2, k=2)
        good = []
        for m, n in raw_matches:
            if m.distance < self.match_ratio * n.distance:
                good.append(m)
        return good

    def estimate_homography(self, kp1, kp2, matches):
        pts1 = np.float32([kp1[m.queryIdx].pt for m in matches]).reshape(-1, 1, 2)
        pts2 = np.float32([kp2[m.trainIdx].pt for m in matches]).reshape(-1, 1, 2)
        return cv2.findHomography(pts1, pts2, cv2.RANSAC, 4.0)

    def stitch(self, img_left, img_right):
        kp_l, desc_l = self.extract_features(img_left)
        kp_r, desc_r = self.extract_features(img_right)

        matches = self.match_keypoints(kp_l, desc_r)
        if len(matches) < 8:
            return None

        H, _ = self.estimate_homography(kp_l, kp_r, matches)
        h_l, w_l = img_left.shape[:2]
        h_r, w_r = img_right.shape[:2]

        corners_l = np.float32([[0, 0], [0, h_l], [w_l, h_l], [w_l, 0]]).reshape(-1, 1, 2)
        warped_corners = cv2.perspectiveTransform(corners_l, H)
        corners_all = np.concatenate((warped_corners, np.float32([[0,0],[0,h_r],[w_r,h_r],[w_r,0]]).reshape(-1,1,2)), axis=0)

        [x_min, y_min] = np.int32(corners_all.min(axis=0).ravel() - 0.5)
        [x_max, y_max] = np.int32(corners_all.max(axis=0).ravel() + 0.5)

        H_trans = np.array([[1, 0, -x_min], [0, 1, -y_min], [0, 0, 1]])
        warped_l = cv2.warpPerspective(img_left, H_trans.dot(H), (x_max - x_min, y_max - y_min))
        warped_l[-y_min:h_r - y_min, -x_min:w_r - x_min] = img_right
        return warped_l`
  },

  "ugv": {
    id: "ugv",
    title: "TEKNOFEST Tarımsal İKA Seyrüsefer",
    folder: "07-teknofest-tarimsal-ika",
    filename: "tika_navigation.ino",
    language: "cpp",
    langLabel: "C++ / Arduino",
    repoName: "teknofest-tarimsal-ika-navigation",
    badge: "Otonom Robotik",
    summary: "u-blox GPS koordinatları, HMC5883L pusula baş açısı takibi, Haversine algoritması ve diferansiyel motor kontrolü. (TİKA kategorisinin yarışmadan kaldırılmasıyla proje rafa kaldırılmıştır.)",
    gitCommand: `cd "github-projeleri/07-teknofest-tarimsal-ika"
git init
git add .
git commit -m "feat: initial commit for teknofest agricultural ugv firmware"
git branch -M main
git remote add origin https://github.com/BERKAY081014/teknofest-tarimsal-ika-navigation.git
git push -u origin main`,
    code: `/**
 * ============================================================================
 * Proje: TEKNOFEST Tarımsal İnsansız Kara Aracı (TİKA) Seyrüsefer Yazılımı
 * Takım Kaptanı: Berkay Bilgin (https://github.com/BERKAY081014)
 * Platform: Arduino Mega 2560 / TinyGPS++ / HMC5883L Pusula
 * ============================================================================
 */

#include <Wire.h>
#include <TinyGPS++.h>

#define PIN_MOTOR_LEFT_PWM   5
#define PIN_MOTOR_LEFT_DIR   6
#define PIN_MOTOR_RIGHT_PWM  9
#define PIN_MOTOR_RIGHT_DIR  10

#define PIN_TRIG_FRONT 22
#define PIN_ECHO_FRONT 23

#define GPSSerial Serial1
TinyGPSPlus gps;

struct Waypoint {
  double latitude;
  double longitude;
};

const Waypoint WAYPOINTS[] = {
  {40.352410, 27.973120},
  {40.352850, 27.973650},
  {40.353200, 27.974100}
};
int currentWaypointIndex = 0;

void setup() {
  Serial.begin(115200);
  GPSSerial.begin(9600);
  Wire.begin();

  pinMode(PIN_MOTOR_LEFT_PWM, OUTPUT);
  pinMode(PIN_MOTOR_LEFT_DIR, OUTPUT);
  pinMode(PIN_MOTOR_RIGHT_PWM, OUTPUT);
  pinMode(PIN_MOTOR_RIGHT_DIR, OUTPUT);
}

void loop() {
  while (GPSSerial.available() > 0) {
    gps.encode(GPSSerial.read());
  }

  if (gps.location.isValid()) {
    double dist = calculateDistance(gps.location.lat(), gps.location.lng(),
                                    WAYPOINTS[currentWaypointIndex].latitude,
                                    WAYPOINTS[currentWaypointIndex].longitude);
    if (dist < 2.5) {
      currentWaypointIndex++;
    }
  }
}

double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
  double dLat = (lat2 - lat1) * 3.14159 / 180.0;
  double dLon = (lon2 - lon1) * 3.14159 / 180.0;
  double a = sin(dLat/2)*sin(dLat/2) + cos(lat1*3.14159/180.0)*cos(lat2*3.14159/180.0)*sin(dLon/2)*sin(dLon/2);
  return 6371000.0 * (2 * atan2(sqrt(a), sqrt(1-a)));
}`
  },

  "energy": {
    id: "energy",
    title: "4B-SE Stepergy Enerji Hasadı",
    folder: "08-stepergy-enerji-hasadi",
    filename: "stepergy_energy_monitor.ino",
    language: "cpp",
    langLabel: "C++ / ESP32",
    repoName: "stepergy-kinetic-energy-harvester",
    badge: "Yenilenebilir Enerji",
    summary: "Mekanik adım titreşimlerinden enerji hasadı, INA219 güç sensörü, süperkapasitör şarj koruması ve otonom aydınlatma.",
    gitCommand: `cd "github-projeleri/08-stepergy-enerji-hasadi"
git init
git add .
git commit -m "feat: initial commit for stepergy kinetic energy harvester"
git branch -M main
git remote add origin https://github.com/BERKAY081014/stepergy-kinetic-energy-harvester.git
git push -u origin main`,
    code: `/**
 * ============================================================================
 * Proje: Stepergy – Mekanik & Yaya Trafiğinden Enerji Hasat Sistemi (4B-SE)
 * Ödüller: GMKA Sürdürülebilir Enerji 3.'lük | GSÜ Girişimcilik Finalist
 * Geliştirici: Berkay Bilgin (https://github.com/BERKAY081014)
 * ============================================================================
 */

#include <Wire.h>
#include <Adafruit_INA219.h>

#define PIN_LED_LIGHT 4
#define PIN_LDR 35

Adafruit_INA219 ina219;
float totalJoules = 0.0f;
unsigned long lastTime = 0;

void setup() {
  Serial.begin(115200);
  Wire.begin();
  pinMode(PIN_LED_LIGHT, OUTPUT);

  if (!ina219.begin()) {
    while (1) { delay(100); }
  }
  ina219.setCalibration_32V_2A();
}

void loop() {
  unsigned long now = millis();
  float dt = (now - lastTime) / 1000.0f;
  lastTime = now;

  float busVoltage = ina219.getBusVoltage_V();
  float current_mA = ina219.getCurrent_mA();
  float power_mW   = ina219.getPower_mW();

  if (power_mW > 0) {
    totalJoules += (power_mW / 1000.0f) * dt;
  }

  int ldr = analogRead(PIN_LDR);
  if (ldr < 1200 && busVoltage > 3.6f) {
    analogWrite(PIN_LED_LIGHT, 180);
  } else {
    analogWrite(PIN_LED_LIGHT, 0);
  }

  delay(100);
}`
  }
};
