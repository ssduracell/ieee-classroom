# VR Classroom for Remote Education

In the scope of the 2018 IEEE Arctic Challenge organized by the IEEE Geoscience and Remote Sensing Society (GRSS) a proof-of-concept virtual reality classroom has been developed. This project aims to solve the problem of the remote education of local communities in the Arctic region. Often these students need to travel long distances to get access to the good basic education that they need. With this project we want to make it possible to no longer travel those long distances while still being able to get access to this good basic education.

# Getting started

### Software

The easiest way to get started is to setup a local webserver similar to as described in the [Networked A-frame server setup](https://github.com/networked-aframe/networked-aframe/blob/master/docs/getting-started-local.md#setup-the-server). Once you have done that replace the entire /server/static/ folder with this repository.

* Student login: localhost:8080
* Teacher login: localhost:8080/teacher.html

### Hardware

There are different hardware requirements for the students and the teacher. This is because the teacher needs to be able to interact more with the virtual environments than the students.

* Student: Smartphone and Google cardboard
* Teacher: 3DOF/6DOF headset with pointing device (e.g. Oculus Go)

# VR environments

In total there are 3 distinct VR environments. Each VR environment has specific features that can be used inside that environment. However, there are also features that are available across all environments.
The 3 environments are:

* **Solar System Big**: In this Solar System the interplanetary distances and the size of all eight planets and the Sun have the correct ratio.
* **Solar System Small**: This Solar System has the correct ratio for the size of the planets. However, the interplanetary distances have been reduced significantly and don't give an accurate representation.
* **Classroom**

As stated before there are a lot of features that can be used in these environments. Therefore a quick overview of the different features will be given categorized by environment:

* **Teacher**

| 		                         | Classroom | Solar System Small | Solar System Big |
| -------------------------------|:---------:|:------------------:|:----------------:|
| Switch between scenes 		 | 	&#9745;  |  	&#9745;  	  | 	&#9745;      |
| Switch between planets		 |  &#9744;  |   	&#9744;	  	  | 	&#9745;		 |
| Place student(s) outside group | 	&#9744;  |   	&#9745; 	  |		&#9745;		 |
| Put all hands down			 |	&#9745;  |		&#9745;		  | 	&#9745;		 |
| Teleport                       |	&#9745;  |		&#9745;		  |		&#9744;		 |

* **Student**

| 		                 | Mini-games | Classroom | Solar System Small | Solar System Big |
| -----------------------|:----------:|:---------:|:------------------:|:----------------:|
| Select turtle 		 | 	&#9744;   |  &#9745;  | 	  &#9745;      |     &#9745;	  |
| Select dizzy emoticon  |  &#9744;   |  &#9745;  | 	  &#9745;      |	 &#9745;	  |
| Select hand 			 | 	&#9744;   |  &#9745;  |	 	  &#9745;	   |	 &#9745;	  |
| Select rabbit			 |	&#9744;   |	 &#9745;  | 	  &#9745;	   | 	 &#9745;	  |
| Move by position cones |	&#9745;   |	 &#9744;  |		  &#9744;	   |	 &#9744;	  |


# Authors
*	[Bart Stukken](http://vr.0x42.be/#contact)	- PXL University College
*	[Wout Swinkels](wout_swinkels@hotmail.be)	- Hasselt University

# Acknowledgment
This project is made possible by:

* [IEEE](https://www.ieee.org/)
* [Freinetschool De Step Beringen](https://www.destep.be/)
* [PXL V-LAB](https://www.pxl.be/Pub/Studenten/Voorzieningen-Student/Subnavigatie-Toekomstige-studenten-Voorzieningen-V-LAB.html)
* [A-frame](https://aframe.io/)

# License
This program is free software and is distributed under an [MIT License](LICENSE.md).
# ieee-classroom
