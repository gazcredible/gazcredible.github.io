var dimmbro2_right = function() { 
this.Skeleton = {
"bones": [
	{ "name": "root", "x": 83.13, "y": -28.73 },
	{ "name": "arm", "parent": "root", "x": 10.12, "y": 23.58 },
	{ "name": "collider_0", "parent": "root", "x": 195.75, "y": -9.63 },
	{ "name": "collider_1", "parent": "root", "x": -7.55, "y": 94.85 },
	{ "name": "collider_2", "parent": "root", "x": -169.55, "y": 102.95 },
	{ "name": "head", "parent": "root", "x": -0.77, "y": 44.22 },
	{ "name": "main", "parent": "root", "x": -26.77, "y": 15.45 },
	{ "name": "truck_back", "parent": "root", "x": -101.99, "y": 57.88 },
	{ "name": "truck_exhaust", "parent": "root", "x": 45.84, "y": 36.66 },
	{ "name": "truck_shouvle", "parent": "root", "x": 86.87, "y": 11.86 },
	{ "name": "wheel_l", "parent": "root", "x": -43.03, "y": -25.43 },
	{ "name": "wheel_s", "parent": "root", "x": 84, "y": -36.78 },
	{ "name": "bone", "parent": "truck_exhaust", "x": 0.22, "y": 8.3 },
	{ "name": "bone2", "parent": "truck_exhaust", "x": 0.25, "y": 15.08 },
	{ "name": "bone3", "parent": "truck_exhaust", "x": 0.02, "y": 17.34 },
	{ "name": "eyes", "parent": "head", "x": -12.05, "y": 38.05 }
],
"slots": [
	{ "name": "truck_wheel_s", "bone": "wheel_s", "attachment": "truck_wheel_s" },
	{ "name": "truck_wheel_l", "bone": "wheel_l", "attachment": "truck_wheel_l" },
	{ "name": "truck_body", "bone": "main", "attachment": "truck_body" },
	{ "name": "truck_back", "bone": "truck_back", "attachment": "truck_back" },
	{ "name": "smoke3", "bone": "bone3", "attachment": "smoke3" },
	{ "name": "smoke2", "bone": "bone2", "attachment": "smoke2" },
	{ "name": "smoke1", "bone": "bone", "attachment": "smoke1" },
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
			"smoke1": { "scaleX": 0.173, "scaleY": 0.173, "width": 256, "height": 256 }
		},
		"smoke2": {
			"smoke2": { "scaleX": 0.162, "scaleY": 0.162, "width": 256, "height": 256 }
		},
		"smoke3": {
			"smoke3": { "x": -0.11, "y": -0.44, "scaleX": 0.142, "scaleY": 0.142, "width": 256, "height": 256 }
		},
		"truck_back": {
			"truck_back": { "x": -2.1, "y": 7.02, "width": 256, "height": 256 }
		},
		"truck_body": {
			"truck_body": { "x": 24.88, "y": 37.33, "width": 512, "height": 512 }
		},
		"truck_exhaust": {
			"truck_exhaust": { "x": -46.88, "y": 16.05, "width": 512, "height": 512 }
		},
		"truck_shovel": {
			"truck_shovel": { "x": -76.66, "y": 37.41, "width": 512, "height": 512 }
		},
		"truck_wheel_l": {
			"truck_wheel_l": { "x": -42.3, "y": 74.66, "width": 512, "height": 512 }
		},
		"truck_wheel_s": {
			"truck_wheel_s": { "x": 81.54, "y": 80.01, "width": 512, "height": 512 }
		}
	}
},
"animations": {
	"drive_right": {
		"bones": {
			"wheel_l": {
				"rotate": [
					{ "time": 0, "angle": -0.59 },
					{ "time": 0.3333, "angle": -91.45 },
					{ "time": 0.6666, "angle": -179.84 },
					{ "time": 1, "angle": 90.38 },
					{ "time": 1.3333, "angle": -0.59 }
				],
				"translate": [
					{ "time": 0, "x": -1.81, "y": -1.35 }
				]
			},
			"wheel_s": {
				"rotate": [
					{ "time": 0, "angle": -0.59 },
					{ "time": 0.3333, "angle": -91.45 },
					{ "time": 0.6666, "angle": -179.84 },
					{ "time": 1, "angle": 90.38 },
					{ "time": 1.3333, "angle": -0.59 }
				],
				"translate": [
					{ "time": 0, "x": -3.48, "y": 1.25 }
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
					{ "time": 0, "angle": -2.22 },
					{ "time": 0.2, "angle": 3.51 },
					{ "time": 0.4333, "angle": -0.12 },
					{ "time": 0.6, "angle": 2.07 },
					{ "time": 0.8, "angle": -1.52 },
					{ "time": 1, "angle": 1.82 },
					{ "time": 1.2, "angle": -2.2 },
					{ "time": 1.3333, "angle": -2.22 }
				],
				"translate": [
					{ "time": 0, "x": 0, "y": 0.93 },
					{ "time": 0.1666, "x": 0, "y": 5.13 },
					{ "time": 0.5666, "x": 0, "y": 0.93 },
					{ "time": 0.7666, "x": 0, "y": 3.26 },
					{ "time": 0.9666, "x": 0, "y": 0.46 },
					{ "time": 1.1666, "x": 0, "y": 1.86 },
					{ "time": 1.3333, "x": 0, "y": 0.93 }
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
				],
				"translate": [
					{ "time": 0, "x": -1.42, "y": -1.93 }
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
				],
				"translate": [
					{ "time": 0, "x": -3.92, "y": 2 }
				]
			},
			"truck_exhaust": {
				"translate": [
					{ "time": 0, "x": -0.7, "y": 0 },
					{ "time": 0.1, "x": -1.65, "y": 3 },
					{ "time": 0.2333, "x": -0.7, "y": 0 },
					{ "time": 0.3, "x": -0.22, "y": 2 },
					{ "time": 0.4333, "x": -1.18, "y": 2 },
					{ "time": 0.6, "x": -0.22, "y": -3 },
					{ "time": 0.7, "x": -0.7, "y": 2 },
					{ "time": 0.8333, "x": 0.24, "y": -4 },
					{ "time": 1.1, "x": 1.67, "y": 1 },
					{ "time": 1.2, "x": -0.7, "y": -5 },
					{ "time": 1.3333, "x": 0.72, "y": 0 }
				],
				"scale": [
					{ "time": 0.2666, "x": 1.175, "y": 0.621 },
					{ "time": 0.3333, "x": 1, "y": 1.077 }
				]
			},
			"bone3": {
				"rotate": [
					{ "time": 0.3333, "angle": -8.94 },
					{ "time": 1.1, "angle": -86.34 }
				],
				"translate": [
					{ "time": 0, "x": 0, "y": -5.61, "curve": "stepped" },
					{ "time": 0.2666, "x": 0, "y": -5.61 },
					{ "time": 0.3333, "x": 0, "y": 32.81 },
					{ "time": 1.1, "x": 0, "y": 48.44 }
				],
				"scale": [
					{ "time": 0, "x": 1.018, "y": 1.018 },
					{ "time": 0.3333, "x": 2.47, "y": 2.47 },
					{ "time": 1.1, "x": 4.936, "y": 4.936 },
					{ "time": 1.1333, "x": -0.011, "y": -0.011 }
				]
			},
			"bone": {
				"rotate": [
					{ "time": 0.4, "angle": -8.94 },
					{ "time": 1.1666, "angle": -86.34 }
				],
				"translate": [
					{ "time": 0, "x": 0, "y": -5.61, "curve": "stepped" },
					{ "time": 0.3, "x": 0, "y": -5.61, "curve": "stepped" },
					{ "time": 0.3333, "x": 0, "y": -5.61 },
					{ "time": 0.4, "x": 0, "y": 32.81 },
					{ "time": 1.1666, "x": 0, "y": 48.44 }
				],
				"scale": [
					{ "time": 0, "x": 1.018, "y": 1.018, "curve": "stepped" },
					{ "time": 0.3, "x": 1.018, "y": 1.018 },
					{ "time": 0.4, "x": 2.47, "y": 2.47 },
					{ "time": 1.1666, "x": 4.936, "y": 4.936 },
					{ "time": 1.2, "x": -0.011, "y": -0.011 }
				]
			},
			"bone2": {
				"rotate": [
					{ "time": 0.5, "angle": -8.94 },
					{ "time": 1.2666, "angle": -86.34 }
				],
				"translate": [
					{ "time": 0, "x": 0, "y": -5.61, "curve": "stepped" },
					{ "time": 0.4, "x": 0, "y": -5.61, "curve": "stepped" },
					{ "time": 0.4333, "x": 0, "y": -5.61 },
					{ "time": 0.5, "x": 0, "y": 32.81 },
					{ "time": 1.2666, "x": 0, "y": 48.44 }
				],
				"scale": [
					{ "time": 0, "x": 1.018, "y": 1.018, "curve": "stepped" },
					{ "time": 0.4, "x": 1.018, "y": 1.018 },
					{ "time": 0.5, "x": 2.47, "y": 2.47 },
					{ "time": 1.2666, "x": 4.936, "y": 4.936 },
					{ "time": 1.3, "x": -0.011, "y": -0.011 }
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
			},
			"truck_back": {
				"attachment": [
					{ "time": 0, "name": "truck_back" }
				]
			}
		}
	}
}
};
this.AtlasData = 
"\n" +
"dimmbro2_right.png\n" +
"format: RGBA8888\n" +
"filter: Linear,Linear\n" +
"repeat: none\n" +
"arm\n" +
"  rotate: false\n" +
"  xy: 284, 86\n" +
"  size: 69, 63\n" +
"  orig: 512, 512\n" +
"  offset: 233, 192\n" +
"  index: -1\n" +
"eyes\n" +
"  rotate: false\n" +
"  xy: 284, 2\n" +
"  size: 50, 35\n" +
"  orig: 512, 512\n" +
"  offset: 227, 279\n" +
"  index: -1\n" +
"head\n" +
"  rotate: false\n" +
"  xy: 280, 151\n" +
"  size: 120, 103\n" +
"  orig: 512, 512\n" +
"  offset: 188, 247\n" +
"  index: -1\n" +
"smoke1\n" +
"  rotate: false\n" +
"  xy: 355, 116\n" +
"  size: 29, 33\n" +
"  orig: 256, 256\n" +
"  offset: 113, 114\n" +
"  index: -1\n" +
"smoke3\n" +
"  rotate: false\n" +
"  xy: 355, 116\n" +
"  size: 29, 33\n" +
"  orig: 256, 256\n" +
"  offset: 113, 114\n" +
"  index: -1\n" +
"smoke2\n" +
"  rotate: false\n" +
"  xy: 355, 116\n" +
"  size: 29, 33\n" +
"  orig: 256, 256\n" +
"  offset: 113, 114\n" +
"  index: -1\n" +
"truck_back\n" +
"  rotate: false\n" +
"  xy: 2, 28\n" +
"  size: 155, 84\n" +
"  orig: 256, 256\n" +
"  offset: 56, 85\n" +
"  index: -1\n" +
"truck_body\n" +
"  rotate: false\n" +
"  xy: 2, 114\n" +
"  size: 276, 140\n" +
"  orig: 512, 512\n" +
"  offset: 89, 141\n" +
"  index: -1\n" +
"truck_exhaust\n" +
"  rotate: false\n" +
"  xy: 482, 222\n" +
"  size: 18, 32\n" +
"  orig: 512, 512\n" +
"  offset: 294, 237\n" +
"  index: -1\n" +
"truck_shovel\n" +
"  rotate: false\n" +
"  xy: 159, 34\n" +
"  size: 123, 78\n" +
"  orig: 512, 512\n" +
"  offset: 321, 157\n" +
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
"  xy: 284, 39\n" +
"  size: 44, 45\n" +
"  orig: 512, 512\n" +
"  offset: 152, 152\n" +
"  index: -1\n" +
"\n";
}
