USE HALL AND FSR SENSORS TO DETERMINE HOW OFTEN THE FRIDGE IS OPENED EACH DAY

1. Setup and expected readings
2. Data model
3. SQL code and output

*********************************************************************

1. Setup and expected readings

I plan to set up the sensors to measure the daily frequency that the fridge door is opened. A ’fridge opened’ event comprises two successive ‘open’ readings, as outlined below and in the description of the data model.

The Hall sensor will detect when the magnet attached to the fridge is in proximity to the sensor fixed to the fridge frame. The FSR sensor will be placed on the gasket that seals the fridge.

I expect the following readings in principle (but see Note about FSR sensor):

When the fridge door is ‘closed’, the magnet is in proximity to the Hall sensor and the FSR sensor is pressed:
- Hall sensor == 1
- FSR sensor > 0
Note: I have noticed that the FSR baseline threshold is in the 0-10 range, so I will define FSR sensor readings > 10 as ‘closed’.

When the fridge door is ‘open’, the magnet is moved away from the the Hall sensor and the FSR sensor is not pressed:
- Hall sensor == 0
- FSR sensor == 0
Note: I have noticed that the FSR baseline threshold is in the 0-10 range, so I will define FSR sensor readings between 0 and 10 as ‘open’.

*********************************************************************

2. Data model

The data model is followed by an example, then by specifics of how the data collection feeds values into the key-value pairs for fridgeOpenedHall and fridgeOpenedFSR, and finally by a couple of alternatives.

Model:
{ date: ‘date’,				// each day of data collection
  fridgeOpenedHall: ‘integer’,		// number of ‘fridge opened’ events on that day, as measured by the Hall sensor
  fridgeOpenedFSR: ‘integer’		// number of ‘fridge opened’ events on that day, as measured by the FSR sensor
}

Example:
{ date: 2017-10-21,			// this example shows the expected values if the Hall and FSR sensors
  fridgeOpenedHall: 7,			// both detected seven ‘fridge opened’ events on October 21, 2017
  fridgeOpenedFSR: 7
}

Specifics of how fridgeOpenedHall and fridgeOpenedFSR are calculated:
The fridge will mostly be in a ’closed’ position and I will be measuring how many ‘fridge opened’ events there are per day for each sensor. (The values should be the same.) The FSR sensor seems a little flaky, so I will define ‘fridge opened’ for each sensor stringently by requiring two consecutive ‘open’ readings. Thus, the values in the model above will be as follows:
- date: from lastheard timestamp
  = subtract 4 hours from timestamp (or 5 hours when Daylight Savings Time ends on November 5th at 2:00)
- fridgeOpenedHall: from hallsensor (Boolean type, converted from Hall sensor values of 0 or 1)
  = number of times per day that there was a run of two or more consecutive hallsensor values of ‘false’, where false is Hall sensor value of 0
- fridgeOpenedFSR; from fsrsensor (smallint type)
  = number of times per day that there was a run of two or more consecutive fsrsensor values in the 0-10 range

Alternatives:
- measure ‘fridge opened’ events as times when both sensors register the door as ‘open’
- measure the length of time of each ‘fridge opened’ event

*********************************************************************

3. SQL code and output

CREATE TABLE sensordata (
hallsensor boolean,
fsrsensor smallint,
lastheard timestamp
);

INSERT INTO sensordata VALUES (true, 3430, '2017-10-21 02:51:16.610234');

SELECT * FROM sensordata;                                                                    
 hallsensor | fsrsensor |         lastheard          
------------+-----------+----------------------------
 t          |      3430 | 2017-10-21 02:51:16.610234
(1 row)