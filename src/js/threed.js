
(function(bertie) {
    'use strict';
	class bertie.threed {
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
			for(var k in this.properties) {
				(function(key) {
					Object.defineProperty(this,key,{
						get:function() {
							return this.properties[key];
						},
						set:function(v) {
							if (this.properties[key]!=v) {
								this.properties[key]=v;
								this.changed();
							}
						}
					});
				}).apply(this,[k]);
			}
			
			this.eye=new bertie.vector()
			this.eyeVector();
		}
		changed() {
			this.eyeVector();
		}
		transpose(px, py, pz) {
			// returns [ polar x, polar y, distance from eye ]
			var p=new bertie.vector(px,py,pz);
			// elevation
			p.rotateX(this.elevation);
			// yaw
			p.rotateY(this.twist);
			// twist
			p.rotateZ(this.yaw);
			//polar position
			var d=p.directions;
			var npx=d[0];
			var npy=d[1];
			var npz=d[2];
			var pa = Math.atan2(npz, npx);
			var r = Math.sqrt(Math.pow(npz, 2)+Math.pow(npx, 2));
			//fromEye
			a = Math.atan2(r, (this.fromEye+npy));
			var ar = this.fromEye*Math.tan(a);
			var inEye = this.fromEye*Math.tan(this.fov);
			var apr = (ar/inEye)*this.onscreen;
			//find x,y
			var ax = apr*Math.cos(pa);
			var ay = apr*Math.sin(pa);
			var fe=Math.sqrt(Math.pow((this.fromEye+npy),2)+Math.pow(r,2));
			var reply = [ax, -ay,fe];
			return reply;
		}
		radiusSize(r,d,e){
			var a=Math.atan2(r,e);
			return d*Math.tan(a);
		}
		eyeVector() {
			this.eye.setDirection(0,-this.fromEye,0);
			this.eye.rotateZ(-this.yaw);
			this.eye.rotateY(-this.twist);
			this.eye.rotateX(-this.elevation);
			this.eye.flip();
		}
	}
}(window.bertie = window.bertie || {}));