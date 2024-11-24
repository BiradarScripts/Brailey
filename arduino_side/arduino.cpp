#include <WiFi.h>       // For ESP32
#include <WebServer.h>  // Lightweight web server library for Arduino

// Replace with your network credentials
const char* ssid = "Your_SSID";
const char* password = "Your_PASSWORD";

// Create a web server object
WebServer server(80); // Use port 80

// This variable will store the received data
String receivedData = "";

// Function to process and print the received data
void processData(const String& data) {
  Serial.println("Processing received data...");
  String tempLine = ""; // Temporarily stores each line
  int blankLineCount = 0; // Tracks consecutive blank lines

  for (int i = 0; i < data.length(); i++) {
    char currentChar = data[i];

    if (currentChar == '\n') {
      if (tempLine.length() == 0) {
        blankLineCount++;
      } else {
        // Print the accumulated line and reset
        Serial.println(tempLine);
        tempLine = "";
        blankLineCount = 0; // Reset blank line count
      }
    } else {
      // Append character to the current line
      tempLine += currentChar;
    }

    // Print empty lines based on blank line count
    if (blankLineCount > 0 && i == data.length() - 1) {
      for (int j = 0; j < blankLineCount; j++) {
        Serial.println();
      }
    }
  }

  // Print any remaining data in tempLine
  if (tempLine.length() > 0) {
    Serial.println(tempLine);
  }
}

void handleRoot() {
  server.send(200, "text/plain", "Arduino is ready to receive data!");
}

void handleReceive() {
  if (server.hasArg("plain")) {  // Check if the request has a body
    receivedData = server.arg("plain"); // Get the body content
    Serial.println("Received raw data:");
    Serial.println(receivedData);

    // Process the received data
    processData(receivedData);

    // Send a success response
    server.send(200, "application/json", "{\"message\":\"Data processed successfully!\"}");
  } else {
    // If no body is sent in the request
    server.send(400, "application/json", "{\"message\":\"No data received!\"}");
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password); // Connect to Wi-Fi

  // Wait for connection
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi. IP address: " + WiFi.localIP().toString());

  // Set up web server routes
  server.on("/", handleRoot);            // Root route
  server.on("/receive", HTTP_POST, handleReceive); // /receive route for POST requests

  // Start the server
  server.begin();
  Serial.println("Web server started.");
}

void loop() {
  // Handle incoming client requests
  server.handleClient();
}
