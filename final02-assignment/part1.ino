// Code flashed to Particle for settings on sensos readings

// -----------------------------------------
// Hall effect sensor and Force Sensitive Resistor (FSR)
// -----------------------------------------

int hall = D0; // This is the input pin where you read the value of the hall sensor.
int fsr = A0; // This is the input pin where you read the value of the fsr sensor.

int hallValue; // Here we are declaring the integer variable hallValue, which we will use later to store the value of the hall sensor.
int fsrValue; // Here we are declaring the integer variable fsrValue, which we will use later to store the value of the fsr sensor.

char json_str[64]; // A placeholder for a string of JSON

void setup() {

    // This lets the device know which pin will be used to read incoming voltage for hall.
    pinMode(hall,INPUT);  // Our sensor pin is input (reading the hall sensor)
    
    // This lets the device know which pin will be used to read incoming voltage for fsr.
    pinMode(fsr,INPUT);  // Our sensor pin is input (reading the fsr sensor)

    // We are going to declare a Particle.variable() here so that we can access the value of the sensor from the cloud.
    Particle.variable("json", json_str);
    // We will fill this in down below.
}

void loop() {

    if (digitalRead(hall) == HIGH) {

        // =0 if magnet is not present
        hallValue = 0;
        delay(100);
        
    }
    
    else {

        // =1 if magnet is present
        hallValue = 1;
        delay(100);
        
    }
    
    fsrValue = analogRead(fsr);
    delay(100);
    
    // provide access to a single variable, string in JSON format
    sprintf(json_str, "{\"hall\": %u, \"fsr\": %u}", hallValue, fsrValue);
    
}