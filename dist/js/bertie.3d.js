/*! bertie.3d 20-09-2017 */

!function(t) {
    "use strict";
    t.threed = function() {
        class e {
            constructor(e) {
                if (void 0 === t.vector) return !1;
                this.properties = {
                    yaw: 0,
                    elevation: 0,
                    twist: 0,
                    fromEye: 800,
                    onscreen: 500,
                    fov: Math.PI / 3
                }, Object.assign(this.properties, e), this.eye = new t.vector(), this.eyeVector();
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
            transpose(e, ...i) {
                var s = null;
                isNaN(e) && e instanceof t.vector ? s = e : 2 == i.length && (s = new t.vector(e, i[0], i[1])), 
                s.rotateX(this.elevation), s.rotateY(this.twist), s.rotateZ(this.yaw);
                var r = Math.atan2(s.directions[2], s.directions[0]), o = Math.sqrt(Math.pow(s.directions[2], 2) + Math.pow(s.directions[0], 2)), h = this.fromEye * Math.tan(Math.atan2(o, this.fromEye + s.directions[1])) / (this.fromEye * Math.tan(this.fov)) * this.onscreen;
                return [ h * Math.cos(r), -h * Math.sin(r), Math.sqrt(Math.pow(this.fromEye + s.directions[1], 2) + Math.pow(o, 2)) ];
            }
            eyeVector() {
                this.eye.setDirection(0, -this.fromEye, 0), this.eye.rotateZ(-this.yaw), this.eye.rotateY(-this.twist), 
                this.eye.rotateX(-this.elevation), this.eye.flip();
            }
        }
        return e;
    }();
}(window.bertie = window.bertie || {});