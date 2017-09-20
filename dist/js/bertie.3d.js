/*! bertie.3d 20-09-2017 */

!function(t) {
    "use strict";
    t.threed = function() {
        class i {
            constructor(i) {
                if (void 0 === t.vector) return !1;
                this.properties = {
                    yaw: 0,
                    elevation: 0,
                    twist: 0,
                    fromEye: 800,
                    onscreen: 500,
                    fov: Math.PI / 3
                }, Object.assign(this.properties, i), this.eye = new t.vector(), this.eyeVector();
            }
            get yaw() {
                return this.properties.yaw;
            }
            get elevation() {
                return this.properties.elevation;
            }
            get twist() {
                return this.properties.twist;
            }
            get fromEye() {
                return this.properties.fromEye;
            }
            get onscreen() {
                return this.properties.onscreen;
            }
            get fov() {
                return this.properties.fov;
            }
            set yaw(t) {
                this.properties.yaw != t && (this.properties.yaw = t, this.changed());
            }
            set elevation(t) {
                this.properties.elevation != t && (this.properties.elevation = t, this.changed());
            }
            set twist(t) {
                this.properties.twist != t && (this.properties.twist = t, this.changed());
            }
            set fromEye(t) {
                this.properties.fromEye != t && (this.properties.fromEye = t, this.changed());
            }
            set onscreen(t) {
                this.properties.onscreen != t && (this.properties.onscreen = t, this.changed());
            }
            set fov(t) {
                this.properties.fov != t && (this.properties.fov = t, this.changed());
            }
            changed() {
                this.eyeVector();
            }
            transpose(i, ...e) {
                var s = null;
                isNaN(i) && i instanceof t.vector ? s = i : 2 == e.length && (s = new t.vector(i, e[0], e[1])), 
                s.rotateX(this.elevation), s.rotateY(this.twist), s.rotateZ(this.yaw);
                var r = Math.atan2(s.directions[2], s.directions[0]), n = Math.sqrt(Math.pow(s.directions[2], 2) + Math.pow(s.directions[0], 2)), h = this.fromEye * Math.tan(Math.atan2(n, this.fromEye + s.directions[1])) / (this.fromEye * Math.tan(this.fov)) * this.onscreen;
                return [ h * Math.cos(r), -h * Math.sin(r), Math.sqrt(Math.pow(this.fromEye + s.directions[1], 2) + Math.pow(n, 2)) ];
            }
            eyeVector() {
                this.eye.setDirection(0, -this.fromEye, 0), this.eye.rotateZ(-this.yaw), this.eye.rotateY(-this.twist), 
                this.eye.rotateX(-this.elevation), this.eye.flip();
            }
        }
        return i;
    }();
}(window.bertie = window.bertie || {}), function(t) {
    "use strict";
    t.vector = function() {
        class i {
            constructor(...t) {
                this.unit = null, this.lengthValue = null, t.length >= 3 ? this.directions = [ t[0], t[1], t[2] ] : this.directions = [ 0, 0, 0 ];
            }
            setDirection(t, i, e) {
                this.directions = [ t, i, e ], this.unit = null, this.lengthValue = null;
            }
            add(t, i, e) {
                this.directions[0] += t, this.directions[1] += i, this.directions[2] += e, this.unit = null, 
                this.lengthValue = null;
            }
            getLength() {
                return null === this.lengthValue && (this.lengthValue = Math.sqrt(Math.pow(this.directions[0], 2) + Math.pow(this.directions[1], 2) + Math.pow(this.directions[2], 2))), 
                this.lengthValue;
            }
            unitVector() {
                return 0 == this.directions[0] && 0 == this.directions[1] && 0 == this.directions[2] ? [ 0, 0, 0 ] : 0 == this.getLength() ? [ 0, 0, 0 ] : ((null === this.unit || isNaN(this.unit[0]) || isNaN(this.unit[1]) || isNaN(this.unit[2])) && (this.unit = [ this.directions[0] / this.getLength(), this.directions[1] / this.getLength(), this.directions[2] / this.getLength() ]), 
                this.unit);
            }
            dotProduct(i) {
                if (i instanceof t.vector) {
                    var e = i.unitVector(), s = this.unitVector();
                    return e[0] * s[0] + e[1] * s[1] + e[2] * s[2];
                }
                return !1;
            }
            flip() {
                this.directions[0] = -this.directions[0], this.directions[1] = -this.directions[1], 
                this.directions[2] = -this.directions[2], this.unit = null, this.lengthValue = null;
            }
            angleBetween(i) {
                if (i instanceof t.vector) {
                    var e = this.dotProduct(i);
                    return Math.PI / 2 - Math.PI / 2 * e;
                }
                return !1;
            }
            rotateX(t) {
                var i = [ 0, 0, 0 ];
                i[0] = this.directions[0], i[1] = this.directions[1] * Math.cos(t) - this.directions[2] * Math.sin(t), 
                i[2] = this.directions[1] * Math.sin(t) + this.directions[2] * Math.cos(t), this.directions = i, 
                this.unit = null, this.lengthValue = null;
            }
            rotateY(t) {
                var i = [ 0, 0, 0 ];
                i[0] = this.directions[0] * Math.cos(t) + this.directions[2] * Math.sin(t), i[1] = this.directions[1], 
                i[2] = this.directions[2] * Math.cos(t) - this.directions[0] * Math.sin(t), this.directions = i, 
                this.unit = null, this.lengthValue = null;
            }
            rotateZ(t) {
                var i = [ 0, 0, 0 ];
                i[0] = this.directions[0] * Math.cos(t) - this.directions[1] * Math.sin(t), i[1] = this.directions[0] * Math.sin(t) + this.directions[1] * Math.cos(t), 
                i[2] = this.directions[2], this.directions = i, this.unit = null, this.lengthValue = null;
            }
            clone() {
                return new vector(this.directions[0], this.directions[1], this.directions[2]);
            }
        }
        return i;
    }();
}(window.bertie = window.bertie || {});