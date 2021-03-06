
(function(bertie) {
    'use strict';
	bertie.threed = (function() {
/**
 * @namespace bertie
 * 
*/
		class bertiethreed {
/**
 * Class defining a 3D space
 * @alias bertie.threed
 * @author Paul I Clark
 * @param {object} - object of property names and values
 * @property {float} yaw - the angle of yaw of the viewer to the focal point - default = 0
 * @property {float} elevation - the angle of elevation (radians) of the viewer to the ground - default = 0
 * @property {float} twist - the angle of twist (radians) of the viewer to the horizon - default = 0
 * @property {integer} fromEye - the distance of the focal point (point(0,0,0)) to the viewer - default = 800
 * @property {integer} onscreen - the pixels on the screen that represent the field-of-view (fov) - default = 500
 * @property {float} fov - the field of view in radians - default = PI/3
 * @property {vector} eye - the vector defining the location of the viewer according to the axial planes, calculated from yaw, twist and elevation
*/
			constructor(opts) {
				if (bertie.vector===undefined) return false;
				this.properties={
					yaw:0,
					elevation:0,
					twist:0,
					fromEye:800,
					onscreen:500,
					fov:Math.PI/3
				};
				Object.assign(this.properties,opts);
				
				this.eye=new bertie.vector();
				this.eyeVector();
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
			set yaw(v) {
				if (this.properties.yaw!=v) {
					this.properties.yaw=v;
					this.changed();
				}
			}
			set elevation(v) {
				if (this.properties.elevation!=v) {
					this.properties.elevation=v;
					this.changed();
				}
			}
			set twist(v) {
				if (this.properties.twist!=v) {
					this.properties.twist=v;
					this.changed();
				}
			}
			set fromEye(v) {
				if (this.properties.fromEye!=v) {
					this.properties.fromEye=v;
					this.changed();
				}
			}
			set onscreen(v) {
				if (this.properties.onscreen!=v) {
					this.properties.onscreen=v;
					this.changed();
				}
			}
			set fov(v) {
				if (this.properties.fov!=v) {
					this.properties.fov=v;
					this.changed();
				}
			}
			changed() {
				this.eyeVector();
			}
/**
 * Transpose a 3D position into a 2D polar coordinate
 * @alias bertie.threed.transpose
 * @method bertie.threed#transpose
 * @param {float|vector} x - 3D x position or a bertie.vector object
 * @param {float} y - 3D y position (if x in not a bertie.vector object)
 * @param {float} z - 3D z position (if x in not a bertie.vector object)
 * @return {array} [x, y, fe] - 2D x position from center, 2D y position from center, distance from the eye;
*/
			transpose(x, ...args) {
				var p=null;
				if (isNaN(x) && x instanceof bertie.vector) {
					p=x;
				}else if (args.length==2) {
					p=new bertie.vector(x,args[0],args[1]);
				}
				// elevation
				p.rotateX(this.elevation);
				// yaw
				p.rotateY(this.twist);
				// twist
				p.rotateZ(this.yaw);
				//polar position
				var pa = Math.atan2(p.directions[2], p.directions[0]); // polar angle
				var r = Math.sqrt(Math.pow(p.directions[2], 2)+Math.pow(p.directions[0], 2)); // polar radius
				//fromEye
				var apr = (
						(
							this.fromEye*Math.tan(
								Math.atan2(r, (this.fromEye+p.directions[1]))
							)
						)/(
							this.fromEye*Math.tan(this.fov)
						)
					)*this.onscreen;
				//find x,y
				return [
					apr*Math.cos(pa),
					-apr*Math.sin(pa),
					Math.sqrt(Math.pow((this.fromEye+p.directions[1]),2)+Math.pow(r,2))
				];
			}
			/*radiusSize(r,d,e){
				var a=Math.atan2(r,e);
				return d*Math.tan(a);
			}*/
/* recalculate the eye vector whenever any other property changes */
			eyeVector() {
				this.eye.setDirection(0,-this.fromEye,0);
				this.eye.rotateZ(-this.yaw);
				this.eye.rotateY(-this.twist);
				this.eye.rotateX(-this.elevation);
				this.eye.flip();
			}
		}
		return bertiethreed;
	}());
}(window.bertie = window.bertie || {}));