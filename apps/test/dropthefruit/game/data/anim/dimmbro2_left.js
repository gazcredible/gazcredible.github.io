var dimmbro2_left = function() { 
this.Skeleton = {
"bones": [
	{ "name": "root", "x": 80.2, "y": -28.73 },
	{ "name": "arm", "parent": "root", "x": 13.06, "y": 23.5 },
	{ "name": "collider_0", "parent": "root", "x": -189.2, "y": -13.28 },
	{ "name": "collider_1", "parent": "root", "x": -1.42, "y": 94.24 },
	{ "name": "collider_2", "parent": "root", "x": 171.13, "y": 99.48 },
	{ "name": "head", "parent": "root", "x": 18.22, "y": 44.14 },
	{ "name": "main", "parent": "root", "x": -23.83, "y": 15.36 },
	{ "name": "truck_back", "parent": "root", "x": 103.36, "y": 33.17 },
	{ "name": "truck_exhaust", "parent": "root", "x": -45.63, "y": 38.33 },
	{ "name": "truck_shouvle", "parent": "root", "x": -85.62, "y": 10.6 },
	{ "name": "wheel_l", "parent": "root", "x": 46.6, "y": -25.51 },
	{ "name": "wheel_s", "parent": "root", "x": -84.33, "y": -38.41 },
	{ "name": "bone", "parent": "truck_exhaust", "x": -6.29, "y": 11.49 },
	{ "name": "bone2", "parent": "truck_exhaust", "x": 6.51, "y": 13.82 },
	{ "name": "bone3", "parent": "truck_exhaust", "y": 24.54 },
	{ "name": "eyes", "parent": "head", "x": -21.93, "y": 38.05 }
],
"slots": [
	{ "name": "truck_wheel_s", "bone": "wheel_s", "attachment": "truck_wheel_s" },
	{ "name": "truck_wheel_l", "bone": "wheel_l", "attachment": "truck_wheel_l" },
	{ "name": "truck_body", "bone": "main", "attachment": "truck_body" },
	{ "name": "truck_back", "bone": "truck_back", "attachment": "truck_back" },
	{ "name": "smoke1", "bone": "bone", "attachment": "smoke1" },
	{ "name": "smoke2", "bone": "bone2", "attachment": "smoke2" },
	{ "name": "smoke3", "bone": "bone3", "attachment": "smoke3" },
	{ "name": "truck_exhaust", "bone": "truck_exhaust", "attachment": "truck_exhaust" },
	{ "name": "truck_shovel", "bone": "truck_shouvle", "attachment": "truck_shovel" },
	{ "name": "arm", "bone": "main", "attachment": "arm" },
	{ "name": "head", "bone": "head", "attachment": "head" },
	{ "name": "eyes", "bone": "eyes", "attachment": "eyes" }
],
"skins": {
	"default": {
		"arm": {
			"arm": { "x": 25.16, "y": 21.77, "width": 512, "height": 512 }
		},
		"eyes": {
			"eyes": { "x": 9.63, "y": -42.75, "width": 512, "height": 512 }
		},
		"head": {
			"head": { "x": -12.29, "y": -5.85, "width": 512, "height": 512 }
		},
		"smoke1": {
			"smoke1": { "width": 256, "height": 256 }
		},
		"smoke2": {
			"smoke2": { "width": 256, "height": 256 }
		},
		"smoke3": {
			"smoke3": { "width": 256, "height": 256 }
		},
		"truck_back": {
			"truck_back": { "x": -98.58, "y": 10.85, "width": 512, "height": 512 }
		},
		"truck_body": {
			"truck_body": { "x": 24.88, "y": 37.33, "width": 512, "height": 512 }
		},
		"truck_exhaust": {
			"truck_exhaust": { "x": 47.53, "y": 14.3, "width": 512, "height": 512 }
		},
		"truck_shovel": {
			"truck_shovel": { "x": 79.49, "y": 38.59, "width": 512, "height": 512 }
		},
		"truck_wheel_l": {
			"truck_wheel_l": { "x": -42.3, "y": 74.66, "width": 512, "height": 512 }
		},
		"truck_wheel_s": {
			"truck_wheel_s": { "x": 81.63, "y": 81.56, "width": 512, "height": 512 }
		}
	}
},
"animations": {
	"drive_left": {
		"bones": {
			"wheel_l": {
				"rotate": [
					{ "time": 0, "angle": -0.14 },
					{ "time": 0.1666, "angle": 44.89 },
					{ "time": 0.3333, "angle": 88.85 },
					{ "time": 0.4333, "angle": 117.92 },
					{ "time": 0.6666, "angle": -179.49 },
					{ "time": 0.8, "angle": -145.02 },
					{ "time": 1, "angle": -90.4 },
					{ "time": 1.3333, "angle": -0.14 }
				]
			},
			"wheel_s": {
				"rotate": [
					{ "time": 0, "angle": -0.14 },
					{ "time": 0.1666, "angle": 45.68 },
					{ "time": 0.2333, "angle": 59.95 },
					{ "time": 0.3333, "angle": 88.85 },
					{ "time": 0.6666, "angle": -179.49 },
					{ "time": 1, "angle": -90.4 },
					{ "time": 1.3333, "angle": -0.14 }
				]
			},
			"main": {
				"translate": [
					{ "time": 0, "x": -0.44, "y": 0 },
					{ "time": 0.1, "x": -0.44, "y": 2.69 },
					{ "time": 0.2, "x": -0.44, "y": -0.9 },
					{ "time": 0.3, "x": -0.44, "y": 1.79 },
					{ "time": 0.4333, "x": -0.44, "y": 1.34 },
					{ "time": 0.6, "x": -0.44, "y": -4.05 },
					{ "time": 0.7, "x": -0.44, "y": 1.79 },
					{ "time": 0.8333, "x": -0.44, "y": -4.5 },
					{ "time": 0.9666, "x": -0.44, "y": -0.9 },
					{ "time": 1.1, "x": -0.44, "y": 1.79 },
					{ "time": 1.2, "x": -0.44, "y": -5.85 },
					{ "time": 1.3333, "x": -0.44, "y": 0 }
				]
			},
			"truck_back": {
				"rotate": [
					{ "time": 0, "angle": 0.02 },
					{ "time": 0.0666, "angle": 0.9 },
					{ "time": 0.1333, "angle": -1.34 },
					{ "time": 0.3, "angle": -0.25 },
					{ "time": 0.4333, "angle": 1.37 },
					{ "time": 0.5333, "angle": -2.68 },
					{ "time": 0.6666, "angle": 2.25 },
					{ "time": 0.7333, "angle": -0.9 },
					{ "time": 0.9333, "angle": 1.34 },
					{ "time": 1.0666, "angle": -0.43 },
					{ "time": 1.1666, "angle": 1.82 },
					{ "time": 1.3, "angle": -0.43 },
					{ "time": 1.3333, "angle": 0.02 }
				],
				"translate": [
					{ "time": 0, "x": 3.59, "y": 5.39 },
					{ "time": 0.1333, "x": 3.59, "y": 4.04 },
					{ "time": 0.2333, "x": 3.59, "y": 1.79 },
					{ "time": 0.3333, "x": 3.59, "y": 4.04 },
					{ "time": 0.4333, "x": 3.59, "y": 5.39 },
					{ "time": 0.5666, "x": 3.59, "y": 1.79 },
					{ "time": 0.7, "x": 3.59, "y": 3.14 },
					{ "time": 0.8333, "x": 3.59, "y": -1.35 },
					{ "time": 0.9666, "x": 3.59, "y": 3.59 },
					{ "time": 1.1, "x": 3.59, "y": 2.69 },
					{ "time": 1.2, "x": 3.59, "y": 0.89 },
					{ "time": 1.3333, "x": 3.59, "y": 5.39 }
				]
			},
			"truck_shouvle": {
				"rotate": [
					{ "time": 0, "angle": 0.89 },
					{ "time": 0.1666, "angle": 10.34 },
					{ "time": 0.2333, "angle": 10.82 },
					{ "time": 0.3, "angle": 9.08 },
					{ "time": 0.4333, "angle": 11.43 },
					{ "time": 0.6, "angle": 10.13 },
					{ "time": 0.7333, "angle": 6.14 },
					{ "time": 0.9, "angle": 14.53 },
					{ "time": 0.9333, "angle": 12.56 },
					{ "time": 1.0666, "angle": 16.23 },
					{ "time": 1.2, "angle": 15.39 },
					{ "time": 1.3333, "angle": 0.89 }
				]
			},
			"eyes": {
				"rotate": [
					{ "time": 0.1, "angle": -1.49 },
					{ "time": 0.5, "angle": -2.29 },
					{ "time": 0.8, "angle": 0.08 },
					{ "time": 1.2666, "angle": -1.21 }
				],
				"translate": [
					{ "time": 0.1, "x": 1, "y": 0.56 },
					{ "time": 0.5, "x": 1.54, "y": 0.84 },
					{ "time": 0.8, "x": -0.05, "y": -0.02 },
					{ "time": 1.2666, "x": 0.81, "y": 0.45 }
				]
			},
			"head": {
				"rotate": [
					{ "time": 0, "angle": 1.49, "curve": "stepped" },
					{ "time": 0.1, "angle": 1.49 },
					{ "time": 0.5, "angle": 2.29 },
					{ "time": 0.8, "angle": -0.08 },
					{ "time": 1.2666, "angle": 1.21 },
					{ "time": 1.3333, "angle": 1.49 }
				]
			},
			"truck_exhaust": {
				"translate": [
					{ "time": 0, "x": -1, "y": 1 },
					{ "time": 0.1, "x": -1, "y": 3.5 },
					{ "time": 0.2, "x": -1, "y": -0.93 },
					{ "time": 0.3, "x": -1, "y": 3, "curve": "stepped" },
					{ "time": 0.4333, "x": -1, "y": 3 },
					{ "time": 0.6, "x": -1, "y": -3 },
					{ "time": 0.7, "x": -1, "y": 2 },
					{ "time": 0.8333, "x": -1, "y": -4 },
					{ "time": 1.1, "x": -1, "y": 3 },
					{ "time": 1.2, "x": -1, "y": -5 },
					{ "time": 1.3333, "x": -1, "y": 0 }
				],
				"scale": [
					{ "time": 0.24, "x": 1.256, "y": 0.637 },
					{ "time": 0.5333, "x": 0.846, "y": 0.942 }
				]
			},
			"bone": {
				"rotate": [
					{ "time": 0.6666, "angle": 1.66 },
					{ "time": 1.2666, "angle": -87.38 }
				],
				"translate": [
					{ "time": 0, "x": 6.55, "y": -6.05 },
					{ "time": 0.6666, "x": 6.2, "y": -5.89 },
					{ "time": 0.8333, "x": 6.41, "y": 21.32 },
					{ "time": 1.2666, "x": 6.45, "y": 32.96 }
				],
				"scale": [
					{ "time": 0, "x": 0.26, "y": 0.26, "curve": "stepped" },
					{ "time": 0.6666, "x": 0.26, "y": 0.26 },
					{ "time": 0.8333, "x": 0.611, "y": 0.611 },
					{ "time": 1.2666, "x": 0.97, "y": 0.97 },
					{ "time": 1.3, "x": -0.023, "y": -0.023 }
				]
			},
			"bone3": {
				"rotate": [
					{ "time": 0.4666, "angle": 1.66 },
					{ "time": 1.0666, "angle": -87.38 }
				],
				"translate": [
					{ "time": 0, "x": 0, "y": -6.05, "curve": "stepped" },
					{ "time": 0.4666, "x": 0, "y": -6.05 },
					{ "time": 0.6333, "x": 0, "y": 23.77 },
					{ "time": 1.0666, "x": 0, "y": 36.39 }
				],
				"scale": [
					{ "time": 0, "x": 0.26, "y": 0.26, "curve": "stepped" },
					{ "time": 0.4666, "x": 0.26, "y": 0.26 },
					{ "time": 0.6333, "x": 0.611, "y": 0.611 },
					{ "time": 1.0666, "x": 0.97, "y": 0.97 },
					{ "time": 1.1, "x": -0.023, "y": -0.023 }
				]
			},
			"bone2": {
				"rotate": [
					{ "time": 0.5666, "angle": 1.66 },
					{ "time": 1.1666, "angle": -87.38 }
				],
				"translate": [
					{ "time": 0, "x": -6.24, "y": -6.05 },
					{ "time": 0.5666, "x": -6.62, "y": -6.23 },
					{ "time": 0.7333, "x": -5.56, "y": 25.9 },
					{ "time": 1.1666, "x": -6.6, "y": 36.12 }
				],
				"scale": [
					{ "time": 0, "x": 0.26, "y": 0.26, "curve": "stepped" },
					{ "time": 0.5666, "x": 0.26, "y": 0.26 },
					{ "time": 0.7333, "x": 0.611, "y": 0.611 },
					{ "time": 1.1666, "x": 0.97, "y": 0.97 },
					{ "time": 1.2, "x": -0.023, "y": -0.023 }
				]
			}
		},
		"slots": {
			"eyes": {
				"attachment": [
					{ "time": 0, "name": null },
					{ "time": 0.4, "name": null },
					{ "time": 0.4666, "name": "eyes" },
					{ "time": 0.5333, "name": null },
					{ "time": 1.1666, "name": "eyes" },
					{ "time": 1.2333, "name": null }
				]
			}
		}
	}
}
};
this.AtlasData = 
"\n" +
"dimmbro2_left.png\n" +
"format: RGBA8888\n" +
"filter: Linear,Linear\n" +
"repeat: none\n" +
"arm\n" +
"  rotate: false\n" +
"  xy: 285, 86\n" +
"  size: 69, 63\n" +
"  orig: 512, 512\n" +
"  offset: 210, 192\n" +
"  index: -1\n" +
"eyes\n" +
"  rotate: false\n" +
"  xy: 285, 2\n" +
"  size: 50, 35\n" +
"  orig: 512, 512\n" +
"  offset: 226, 279\n" +
"  index: -1\n" +
"head\n" +
"  rotate: false\n" +
"  xy: 280, 151\n" +
"  size: 120, 103\n" +
"  orig: 512, 512\n" +
"  offset: 204, 247\n" +
"  index: -1\n" +
"smoke1\n" +
"  rotate: false\n" +
"  xy: 356, 116\n" +
"  size: 29, 33\n" +
"  orig: 256, 256\n" +
"  offset: 113, 114\n" +
"  index: -1\n" +
"smoke3\n" +
"  rotate: false\n" +
"  xy: 356, 116\n" +
"  size: 29, 33\n" +
"  orig: 256, 256\n" +
"  offset: 113, 114\n" +
"  index: -1\n" +
"smoke2\n" +
"  rotate: false\n" +
"  xy: 356, 116\n" +
"  size: 29, 33\n" +
"  orig: 256, 256\n" +
"  offset: 113, 114\n" +
"  index: -1\n" +
"truck_back\n" +
"  rotate: false\n" +
"  xy: 2, 27\n" +
"  size: 156, 85\n" +
"  orig: 512, 512\n" +
"  offset: 274, 228\n" +
"  index: -1\n" +
"truck_body\n" +
"  rotate: false\n" +
"  xy: 2, 114\n" +
"  size: 276, 140\n" +
"  orig: 512, 512\n" +
"  offset: 147, 141\n" +
"  index: -1\n" +
"truck_exhaust\n" +
"  rotate: false\n" +
"  xy: 482, 222\n" +
"  size: 18, 32\n" +
"  orig: 512, 512\n" +
"  offset: 200, 237\n" +
"  index: -1\n" +
"truck_shovel\n" +
"  rotate: false\n" +
"  xy: 160, 34\n" +
"  size: 123, 78\n" +
"  orig: 512, 512\n" +
"  offset: 68, 157\n" +
"  index: -1\n" +
"truck_wheel_l\n" +
"  rotate: false\n" +
"  xy: 402, 175\n" +
"  size: 78, 79\n" +
"  orig: 512, 512\n" +
"  offset: 258, 142\n" +
"  index: -1\n" +
"truck_wheel_s\n" +
"  rotate: false\n" +
"  xy: 285, 39\n" +
"  size: 44, 45\n" +
"  orig: 512, 512\n" +
"  offset: 152, 152\n" +
"  index: -1\n" +
"\n";
}
