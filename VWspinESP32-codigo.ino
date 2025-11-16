#include <IOXhop_FirebaseESP32.h>
#include <WiFi.h> 
#include <ArduinoJson.h>

#define WIFI_SSID "REDE WIFI"
#define WIFI_PASSWORD "SENHA WIFI"
#define FIREBASE_HOST "HOST FIREBASE"
#define FIREBASE_AUTH "SENHA FIREBASE"
//definir senha, host, wifi e etc.

//Botões entradas
const int tct1 = 26;
const int tct2 = 25;
const int tct3 = 33;
const int tct4 = 32;
const int tct5 = 35;
const int tct6 = 34;
const int Ret = 27;
const int Pro = 14;
const int CR = 12;

int cont1;
int cont2;
int cont3;
int cont4;
int cont5;
int cont6;
int contG;

//LEDs entradas
const int ld1 = 4;
const int ld2 = 18;
const int ld3 = 19;
const int ld4 = 21;
const int ld5 = 22;
const int ld6 = 23;
const int ldR = 2;

//produtos
int cubo1;
int cubo2;
int cubo3;
int cubo4;
int cubo5;
int cubo6;

bool R = false;


int Retra;

void setup()
{
  Serial.begin(115200);
 
  //entradas de botões
  pinMode(tct1, INPUT_PULLUP);
  pinMode(tct2, INPUT_PULLUP);
  pinMode(tct3, INPUT_PULLUP);
  pinMode(tct4, INPUT_PULLUP);
  pinMode(tct5, INPUT_PULLUP);
  pinMode(tct6, INPUT_PULLUP);
  pinMode(Ret, INPUT_PULLUP);
  pinMode(Pro, INPUT_PULLUP);
  pinMode(CR, INPUT_PULLUP);
 
  //saidas de LEDs
  pinMode(ld1, OUTPUT);
  pinMode(ld2, OUTPUT);
  pinMode(ld3, OUTPUT);
  pinMode(ld4, OUTPUT);
  pinMode(ld5, OUTPUT);
  pinMode(ld6, OUTPUT);
  pinMode(ldR, OUTPUT);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Conectando WiFI");

  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }

  Serial.println();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}
void loop()
{
 
  if (digitalRead(tct1) == LOW){
    cont1++;
  }
  
  if (digitalRead(tct2) == LOW){
    cont2++;
  }
  
  if (digitalRead(tct3) == LOW){
    cont3++;
  }
  
  if (digitalRead(tct4) == LOW){
    cont4++;
  }
  
  if (digitalRead(tct5) == LOW){
    cont5++;
  }
  
  if (digitalRead(tct6) == LOW){
    cont6++;
  }
  
  if (digitalRead(tct1) == LOW){
    if (cubo1 == 0){
    if (cont1 == 1){
      cubo1++;
      digitalWrite(ld1, HIGH);
      delay(500);
      digitalWrite(ld1, LOW);
    
      Firebase.setInt("/codigos/0001/etapa", cubo1);
      Firebase.setInt("/codigos/0001/tempo", 35);
      Firebase.setInt("/coisas1/0001", cubo1);
      Firebase.setInt("/tempos/0001", 35); 
    }
    }
    
    if (cubo2 == 0){
    if (cont1 == 2){
      cubo2++;
      digitalWrite(ld1, HIGH);
      delay(500);
      digitalWrite(ld1, LOW);
      
      Firebase.setInt("/codigos/0002/etapa", cubo2);
      Firebase.setInt("/codigos/0002/tempo", 35); 
      Firebase.setInt("/coisas1/0002", cubo2);
      Firebase.setInt("/tempos/0002", 35); 
    }
    }
      
    if (cubo3 == 0){
    if (cont1 == 3){
      cubo3++;
      digitalWrite(ld1, HIGH);
      delay(500);
      digitalWrite(ld1, LOW);
      
      Firebase.setInt("/codigos/0003/etapa", cubo3);
      Firebase.setInt("/codigos/0003/tempo", 35); 
      Firebase.setInt("/coisas1/0003", cubo3);
      Firebase.setInt("/tempos/0003", 35); 
    }
    }
      
    if (cubo4 == 0){
    if (cont1 == 4){
      cubo4++;
      digitalWrite(ld1, HIGH);
      delay(500);
      digitalWrite(ld1, LOW);  
      
      Firebase.setInt("/codigos/0004/etapa", cubo4);
      Firebase.setInt("/codigos/0004/tempo", 35); 
      Firebase.setInt("/coisas1/0004", cubo4);
      Firebase.setInt("/tempos/0004", 35); 
    }
    }
      
    if (cubo5 == 0){
    if (cont1 == 5){
      cubo5++;
      digitalWrite(ld1, HIGH);
      delay(500);
      digitalWrite(ld1, LOW);

      Firebase.setInt("/codigos/0005/etapa", cubo5);
      Firebase.setInt("/codigos/0005/tempo", 35); 
      Firebase.setInt("/coisas1/0005", cubo5);
      Firebase.setInt("/tempos/0005", 35); 
    }
    }
      
    if (cubo6 == 0){
    if (cont1 == 6){
      cubo6++;
      digitalWrite(ld1, HIGH);
      delay(500);
      digitalWrite(ld1, LOW);
      
      Firebase.setInt("/codigos/0006/etapa", cubo6);
      Firebase.setInt("/codigos/0006/tempo", 35); 
      Firebase.setInt("/coisas1/0006", cubo6);
      Firebase.setInt("/tempos/0006", 35); 
    }
    }
  }
   
  if (digitalRead(tct2) == LOW){
    if (cubo1== 1){
    if (cont2== 1){
      cubo1++;
      digitalWrite(ld2, HIGH);
      delay(500);
      digitalWrite(ld2, LOW);
      
      Firebase.setInt("/codigos/0001/etapa", cubo1);
      Firebase.setInt("/codigos/0001/tempo", 48); 
      Firebase.setInt("/coisas1/0001", cubo1);
      Firebase.setInt("/tempos/0001", 48); 
      
    }
    }
    
    if (cubo2 == 1){
    if (cont2 == 2){
      cubo2++;
      digitalWrite(ld2, HIGH);
      delay(500);
      digitalWrite(ld2, LOW);
      
      Firebase.setInt("/codigos/0002/etapa", cubo2);
      Firebase.setInt("/codigos/0002/tempo", 48); 
      Firebase.setInt("/coisas1/0002", cubo2);
      Firebase.setInt("/tempos/0002", 48); 
      
    }
    }
    
    if (cubo3== 1){
    if (cont2== 3){
      cubo3++;
      digitalWrite(ld2, HIGH);
      delay(500);
      digitalWrite(ld2, LOW);
      
      Firebase.setInt("/codigos/0003/etapa", cubo3);
      Firebase.setInt("/codigos/0003/tempo", 48); 
      Firebase.setInt("/coisas1/0003", cubo3);
      Firebase.setInt("/tempos/0003", 48); 
      
    }
    }
    
    if (cubo4== 1){
    if (cont2== 4){
      cubo4++;
      digitalWrite(ld2, HIGH);
      delay(500);
      digitalWrite(ld2, LOW);
       
      Firebase.setInt("/codigos/0004/etapa", cubo4);
      Firebase.setInt("/codigos/0004/tempo", 48); 
      Firebase.setInt("/coisas1/0004", cubo4);
      Firebase.setInt("/tempos/0004", 48); 
      
    }
    }
    
    if (cubo5== 1){
    if (cont2== 5){
      cubo5++;
      digitalWrite(ld2, HIGH);
      delay(500);
      digitalWrite(ld2, LOW);
      
      Firebase.setInt("/codigos/0005/etapa", cubo5);
      Firebase.setInt("/codigos/0005/tempo", 48);
      Firebase.setInt("/coisas1/0005", cubo5);
      Firebase.setInt("/tempos/0005", 48); 
      
    }
    }
    
    if (cubo6== 1){
    if (cont2== 6){
      cubo6++;
      digitalWrite(ld2, HIGH);
      delay(500);
      digitalWrite(ld2, LOW);
      
      Firebase.setInt("/codigos/0006/etapa", cubo6);
      Firebase.setInt("/codigos/0006/tempo", 48); 
      Firebase.setInt("/coisas1/0006", cubo6);
      Firebase.setInt("/tempos/0006", 48); 
      
    }
    }
  }
  
  if (digitalRead(tct3) == LOW){
    if (cubo1== 2){
    if (cont3== 1){
      cubo1++;
      digitalWrite(ld3, HIGH);
      delay(500);
      digitalWrite(ld3, LOW);
      
      Firebase.setInt("/codigos/0001/etapa", cubo1);
      Firebase.setInt("/codigos/0001/tempo", 40); 
      Firebase.setInt("/coisas1/0001", cubo1);
      Firebase.setInt("/tempos/0001", 40); 
      
    }
    }
    
    if (cubo2== 2){
    if (cont3== 2){
      cubo2++;
      digitalWrite(ld3, HIGH);
      delay(500);
      digitalWrite(ld3, LOW);
      
      Firebase.setInt("/codigos/0002/etapa", cubo2);
      Firebase.setInt("/codigos/0002/tempo", 40); 
      Firebase.setInt("/coisas1/0002", cubo2);
      Firebase.setInt("/tempos/0002", 40);
      
    }
    }
    
    if (cubo3== 2){
    if (cont3== 3){
      cubo3++;
      digitalWrite(ld3, HIGH);
      delay(500);
      digitalWrite(ld3, LOW);
      
      Firebase.setInt("/codigos/0003/etapa", cubo3);
      Firebase.setInt("/codigos/0003/tempo", 40); 
      Firebase.setInt("/coisas1/0003", cubo3);
      Firebase.setInt("/tempos/0003", 40); 
      
    }
    }
    
    if (cubo4== 2){
    if (cont3== 4){
      cubo4++;
      digitalWrite(ld3, HIGH);
      delay(500);
      digitalWrite(ld3, LOW);
      
      Firebase.setInt("/codigos/0004/etapa", cubo4);
      Firebase.setInt("/codigos/0004/tempo", 40); 
      Firebase.setInt("/coisas1/0004", cubo4);
      Firebase.setInt("/tempos/0004", 40); 
      
    }
    }
    
    if (cubo5== 2){
    if (cont3== 5){
      cubo5++;
      digitalWrite(ld3, HIGH);
      delay(500);
      digitalWrite(ld3, LOW);
      
      Firebase.setInt("/codigos/0005/etapa", cubo5);
      Firebase.setInt("/codigos/0005/tempo", 40); 
      Firebase.setInt("/coisas1/0005", cubo5);
      Firebase.setInt("/tempos/0005", 40); 
      
    }
    }
    
    if (cubo6== 2){
    if (cont3== 6){
      cubo6++;
      digitalWrite(ld3, HIGH);
      delay(500);
      digitalWrite(ld3, LOW);
      
      Firebase.setInt("/codigos/0006/etapa", cubo6);
      Firebase.setInt("/codigos/0006/tempo", 40); 
      Firebase.setInt("/coisas1/0006", cubo6);
      Firebase.setInt("/tempos/0006", 40); 
      
    }
    }
  }
  
  if (digitalRead(tct4) == LOW){
    if (cubo1== 3){
    if (cont4== 1){
      cubo1++;
      digitalWrite(ld4, HIGH);
      delay(500);
      digitalWrite(ld4, LOW);
      
      Firebase.setInt("/codigos/0001/etapa", cubo1);
      Firebase.setInt("/codigos/0001/tempo", 15); 
      Firebase.setInt("/coisas1/0001", cubo1);
      Firebase.setInt("/tempos/0001", 15);
      
    }
    }
    
    if (cubo2== 3){
    if (cont4== 2){
      cubo2++;
      digitalWrite(ld4, HIGH);
      delay(500);
      digitalWrite(ld4, LOW);
      
      Firebase.setInt("/codigos/0002/etapa", cubo2);
      Firebase.setInt("/codigos/0002/tempo", 15); 
      Firebase.setInt("/coisas1/0002", cubo2);
      Firebase.setInt("/tempos/0002", 15); 
      
    }
    }
    
    if (cubo3== 3){
    if (cont4== 3){
      cubo3++;
      digitalWrite(ld4, HIGH);
      delay(500);
      digitalWrite(ld4, LOW);
      
      Firebase.setInt("/codigos/0003/etapa", cubo3);
      Firebase.setInt("/codigos/0003/tempo", 15); 
      Firebase.setInt("/coisas1/0003", cubo3);
      Firebase.setInt("/tempos/0003", 15); 
      
    }
    }
    
    if (cubo4 == 3){
    if (cont4 == 4){
      cubo4++;
      digitalWrite(ld4, HIGH);
      delay(500);
      digitalWrite(ld4, LOW);
      
      Firebase.setInt("/codigos/0004/etapa", cubo4);
      Firebase.setInt("/codigos/0004/tempo", 15); 
      Firebase.setInt("/coisas1/0004", cubo4);
      Firebase.setInt("/tempos/0004", 15);
      
    }
    }
    
    if (cubo5 == 3){
    if (cont4 == 5){
      cubo5++;
      digitalWrite(ld4, HIGH);
      delay(500);
      digitalWrite(ld4, LOW);
      
      Firebase.setInt("/codigos/0005/etapa", cubo5);
      Firebase.setInt("/codigos/0005/tempo", 15);
      Firebase.setInt("/coisas1/0005", cubo5);
      Firebase.setInt("/tempos/0005", 15); 
      
    }
    }
    
    if (cubo6 == 3){
    if (cont4 == 6){
      cubo6++;
      digitalWrite(ld4, HIGH);
      delay(500);
      digitalWrite(ld4, LOW);
      
      Firebase.setInt("/codigos/0006/etapa", cubo6);
      Firebase.setInt("/codigos/0006/tempo", 15); 
      Firebase.setInt("/coisas1/0006", cubo6);
      Firebase.setInt("/tempos/0006", 15); 
      
    }
    }
  }
  
  if (digitalRead(tct5) == LOW){
    if (cubo1 == 4){
    if (cont5 == 1){
      cubo1++;
      digitalWrite(ld5, HIGH);
      delay(500);
      digitalWrite(ld5, LOW);
      
      Firebase.setInt("/codigos/0001/etapa", cubo1);
      Firebase.setInt("/codigos/0001/tempo", 35); 
      Firebase.setInt("/coisas1/0001", cubo1);
      Firebase.setInt("/tempos/0001", 35); 
      
    }
    }
    
    if (cubo2 == 4){
    if (cont5 == 2){
      cubo2++;
      digitalWrite(ld5, HIGH);
      delay(500);
      digitalWrite(ld5, LOW);
      
      Firebase.setInt("/codigos/0002/etapa", cubo2);
      Firebase.setInt("/codigos/0002/tempo", 35); 
      Firebase.setInt("/coisas1/0002", cubo2);
      Firebase.setInt("/tempos/0002", 35); 
      
    }
    }
    
    if (cubo3 == 4){
    if (cont5 == 3){
      cubo3++;
      digitalWrite(ld5, HIGH);
      delay(500);
      digitalWrite(ld5, LOW);
      
      Firebase.setInt("/codigos/0003/etapa", cubo3);
      Firebase.setInt("/codigos/0003/tempo", 35); 
      Firebase.setInt("/coisas1/0003", cubo3);
      Firebase.setInt("/tempos/0003", 35); 
      
    }
    }
    
    if (cubo4 == 4){
    if (cont5 == 4){
      cubo4++;
      digitalWrite(ld5, HIGH);
      delay(500);
      digitalWrite(ld5, LOW);
      
      Firebase.setInt("/codigos/0004/etapa", cubo4);
      Firebase.setInt("/codigos/0004/tempo", 35); 
      Firebase.setInt("/coisas1/0004", cubo4);
      Firebase.setInt("/tempos/0004", 35); 
      
    }
    }
    
    if (cubo5 == 4){
    if (cont5 == 5){
      cubo5++;
      digitalWrite(ld5, HIGH);
      delay(500);
      digitalWrite(ld5, LOW);
      
      Firebase.setInt("/codigos/0005/etapa", cubo5);
      Firebase.setInt("/codigos/0005/tempo", 35); 
      Firebase.setInt("/coisas1/0005", cubo5);
      Firebase.setInt("/tempos/0005", 35); 
      
    }
    }
    
    if (cubo6 == 4){
    if (cont5 == 6){
      cubo6++;
      digitalWrite(ld5, HIGH);
      delay(500);
      digitalWrite(ld5, LOW);
      
      Firebase.setInt("/codigos/0006/etapa", cubo6);
      Firebase.setInt("/codigos/0006/tempo", 35); 
      Firebase.setInt("/coisas1/0006", cubo6);
      Firebase.setInt("/tempos/0006", 35);
      
    }
    }
  }
  
  if (digitalRead(tct6) == LOW){
    if (cubo1 == 5){
    if (cont6 == 1){
      cubo1++;
      digitalWrite(ld6, HIGH);
      delay(500);
      digitalWrite(ld6, LOW);
      
      Firebase.setInt("/codigos/0001/etapa", cubo1);
      Firebase.setInt("/codigos/0001/tempo", 12); 
      Firebase.setInt("/coisas1/0001", cubo1);
      Firebase.setInt("/tempos/0001", 12); 
      
    }
    }
    
    if (cubo2 == 5){
    if (cont6 == 2){
      cubo2++;
      digitalWrite(ld6, HIGH);
      delay(500);
      digitalWrite(ld6, LOW);
      
      Firebase.setInt("/codigos/0002/etapa", cubo2);
      Firebase.setInt("/codigos/0002/tempo", 12); 
      Firebase.setInt("/coisas1/0002", cubo2);
      Firebase.setInt("/tempos/0002", 12);
      
    }
    }
    
    if (cubo3 == 5){
    if (cont6 == 3){
      cubo3++;
      digitalWrite(ld6, HIGH);
      delay(500);
      digitalWrite(ld6, LOW);
      
      Firebase.setInt("/codigos/0003/etapa", cubo3);
      Firebase.setInt("/codigos/0003/tempo", 12); 
      Firebase.setInt("/coisas1/0003", cubo3);
      Firebase.setInt("/tempos/0003", 12); 
      
    }
    }
    
    if (cubo4 == 5){
    if (cont6 == 4){
      cubo4++;
      digitalWrite(ld6, HIGH);
      delay(500);
      digitalWrite(ld6, LOW);
      
      Firebase.setInt("/codigos/0004/etapa", cubo4);
      Firebase.setInt("/codigos/0004/tempo", 12); 
      Firebase.setInt("/coisas1/0004", cubo4);
      Firebase.setInt("/tempos/0004", 12); 
      
    }
    }
    
    if (cubo5 == 5){
    if (cont6 == 5){
      cubo5++;
      digitalWrite(ld6, HIGH);
      delay(500);
      digitalWrite(ld6, LOW);
      
      Firebase.setInt("/codigos/0005/etapa", cubo5);
      Firebase.setInt("/codigos/0005/tempo", 12); 
      Firebase.setInt("/coisas1/0005", cubo5);
      Firebase.setInt("/tempos/0005", 12); 
      
    }
    }
    
    if (cubo6 == 5){
    if (cont6 == 6){
      cubo6++;
      digitalWrite(ld6, HIGH);
      delay(500);
      digitalWrite(ld6, LOW);
      
      Firebase.setInt("/codigos/0006/etapa", cubo6);
      Firebase.setInt("/codigos/0006/tempo", 12);
      Firebase.setInt("/coisas1/0006", cubo6);
      Firebase.setInt("/tempos/0006", 12); 
      
    }
    }
  }
   
  if (digitalRead(Ret) == LOW){
    R = true;
    if (cubo1 == 3){
      Firebase.setBool("/codigos/0001/retrabalho", true);
    }
    
    if (cubo2 == 3){
      Firebase.setBool("/codigos/0002/retrabalho", true);
    }
    
    if (cubo3 == 3){
      Firebase.setBool("/codigos/0003/retrabalho", true);
    }
    
    if (cubo4 == 3){
      Firebase.setBool("/codigos/0004/retrabalho", true);
    }
    
    if (cubo5 == 3){
      Firebase.setBool("/codigos/0005/retrabalho", true);
    }
    
    if (cubo6 == 3){
      Firebase.setBool("/codigos/0006/retrabalho", true);
    }
  }
  
 if (digitalRead(Pro) == LOW){
    R = true;
 }

  if (digitalRead(CR) == LOW){
    R = false;
    digitalWrite(ldR, LOW);
    Firebase.setBool("/codigos/0001/retrabalho", false);
    Firebase.setBool("/codigos/0002/retrabalho", false);
    Firebase.setBool("/codigos/0003/retrabalho", false);
    Firebase.setBool("/codigos/0004/retrabalho", false);
    Firebase.setBool("/codigos/0005/retrabalho", false);
    Firebase.setBool("/codigos/0006/retrabalho", false);
  }
  
  if (R){
    digitalWrite(ldR, HIGH);
    delay(500);
    digitalWrite(ldR, LOW);
    delay(500);
  }
}