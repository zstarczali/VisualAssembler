// Vector / Matrix: the rotating cube of the KickAssembler manual (14.5)
* = $1000
.var Cube = List().add(Vector(1,1,1), Vector(1,1,-1), Vector(1,-1,1), Vector(1,-1,-1), Vector(-1,1,1), Vector(-1,1,-1), Vector(-1,-1,1), Vector(-1,-1,-1))
.macro PrecalcObject(object, animLength, nrOfXrot, nrOfYrot, nrOfZrot) {
       .var frames = List()
       .for(var frameNr=0; frameNr<animLength;frameNr++) {
              .var aX = toRadians(frameNr*360*nrOfXrot/animLength)
              .var aY = toRadians(frameNr*360*nrOfYrot/animLength)
              .var aZ = toRadians(frameNr*360*nrOfZrot/animLength)
              .var zp = 2.5
              .var m = ScaleMatrix(120,120,0)*PerspectiveMatrix(zp)*MoveMatrix(0,0,zp+5)*RotationMatrix(aX,aY,aZ)
              .var coords = List()
              .for (var i=0; i<object.size(); i++) {
                     .eval coords.add(m*object.get(i))
              }
              .eval frames.add(coords)
       }
       .for (var coordNr=0; coordNr<object.size(); coordNr++) {
              .for (var xy=0;xy<2; xy++) {
                     .fill animLength, $80+round(frames.get(i).get(coordNr).get(xy))
              }
       }
}
.align $100
cubeCoords: PrecalcObject(Cube,64,2,-1,1)
.print "V " + Vector(1,2,3) + " dot " + Vector(1,2,3)*Vector(2,3,4) + " x " + Vector(0,1,0).X(Vector(1,0,0)) + " M " + Matrix()
