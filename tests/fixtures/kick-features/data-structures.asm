* = $1000
.var l = List().add(3, 1, 2)
.eval l.sort()
.byte l.get(0), l.get(2), l.size()
.var h = Hashtable().put("a", 7, "b", 8)
.byte h.get("b"), h.containsKey("c") ? 1 : 0
.struct Point {x, y}
.var p = Point(4, 5)
.eval p.x = 9
.byte p.x, p.y, p.getNoOfFields()
.var s = "Hello"
.byte s.size(), s.charAt(1), "ff".asNumber(16)
.text s.toUpperCase() + toIntString(42)
.enum {E0, E1, E5 = 5, E6}
.byte E0, E1, E5, E6
.define dl {
 .var dl = List()
 .for (var i = 0; i < 3; i++) .eval dl.add(i * 10)
}
.byte dl.get(2)
