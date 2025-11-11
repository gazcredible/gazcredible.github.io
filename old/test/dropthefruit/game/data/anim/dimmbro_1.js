var dimmbro_1 = function() { 
this.Skeleton = {
"bones": [
	{ "name": "root" },
	{ "name": "head", "parent": "root", "x": 38.68, "y": 39.5 },
	{ "name": "main bod 2", "parent": "root", "x": 15.08, "y": 20.76 },
	{ "name": "shoulder", "parent": "root", "length": 26.66, "x": -2.68, "y": -10.82, "rotation": -91.36 },
	{ "name": "arm", "parent": "shoulder", "length": 24.35, "x": 25.09, "y": 0.19, "rotation": 2.31 },
	{ "name": "eyes", "parent": "head", "x": -31.09, "y": -44.25 },
	{ "name": "main bod", "parent": "head", "x": -44.29, "y": -18.42 },
	{ "name": "hand", "parent": "arm", "length": 26.45, "x": 24.35, "y": 0.04, "rotation": -4.37 },
	{ "name": "throwing hand", "parent": "arm", "x": 50.26, "y": -2.66, "rotation": -4.37 }
],
"slots": [
	{ "name": "main bod", "bone": "main bod", "attachment": "DimmBro1/arm sep/main bod" },
	{ "name": "main bod 2", "bone": "main bod 2", "attachment": "DimmBro1/arm sep/main bod 2" },
	{ "name": "head_r", "bone": "head", "attachment": "head_r" },
	{ "name": "eyes_r", "bone": "eyes", "attachment": "eyes_r" },
	{ "name": "shoulder", "bone": "shoulder", "attachment": "DimmBro1/arm sep/shoulder_gen" },
	{ "name": "arm", "bone": "arm", "attachment": "DimmBro1/arm sep/arm_gen" },
	{ "name": "hand_right", "bone": "hand", "attachment": "DimmBro1/arm sep/hand_right" },
	{ "name": "hand", "bone": "hand", "attachment": "DimmBro1/arm sep/hand_left" }
],
"skins": {
	"default": {
		"arm": {
			"DimmBro1/arm sep/arm_gen": { "x": 2.92, "y": 10.53, "rotation": 89.04, "width": 128, "height": 128 }
		},
		"eyes_r": {
			"eyes_l": { "x": 8.49, "y": 9.34, "width": 256, "height": 256 },
			"eyes_r": { "x": 17.91, "y": 9.03, "rotation": -0.3, "width": 256, "height": 256 }
		},
		"hand": {
			"DimmBro1/arm sep/hand_left": { "x": -26.91, "y": 6.8, "scaleY": 1.127, "rotation": 93.42, "width": 128, "height": 128 }
		},
		"hand_right": {
			"DimmBro1/arm sep/hand_right": { "x": -20.2, "y": 10.16, "rotation": 91.18, "width": 128, "height": 128 }
		},
		"head_r": {
			"head_l": { "x": -31.46, "y": -36.05, "width": 256, "height": 256 },
			"head_r": { "x": -12.43, "y": -35.53, "rotation": 1.14, "width": 256, "height": 256 }
		},
		"main bod": {
			"DimmBro1/arm sep/main bod": { "x": 11.75, "y": -57.62, "width": 128, "height": 128 }
		},
		"main bod 2": {
			"DimmBro1/arm sep/main bod 2": { "x": -17.03, "y": -58.61, "width": 128, "height": 128 }
		},
		"shoulder": {
			"DimmBro1/arm sep/shoulder_gen": { "x": 26.76, "y": 12, "rotation": 91.36, "width": 128, "height": 128 }
		}
	}
},
"animations": {
	"track": {
		"bones": {
			"eyes": {
				"translate": [
					{ "time": 3.3449, "x": -8.94, "y": -2.89, "curve": "stepped" },
					{ "time": 9.9009, "x": -8.94, "y": -2.89 },
					{ "time": 10.0347, "x": -41.63, "y": 0.27, "curve": "stepped" },
					{ "time": 12.0416, "x": -41.63, "y": 0.27 },
					{ "time": 12.1754, "x": 0.11, "y": 0.27 }
				]
			},
			"head": {
				"translate": [
					{ "time": 3.3449, "x": -32.69, "y": 2.89, "curve": "stepped" },
					{ "time": 9.9009, "x": -32.69, "y": 2.89 },
					{ "time": 10.0347, "x": -0.01, "y": -0.27 }
				]
			},
			"shoulder": {
				"rotate": [
					{ "time": 0, "angle": 60.37 },
					{ "time": 3.3449, "angle": 2.93 },
					{ "time": 6.6898, "angle": -65.87 },
					{ "time": 10.0347, "angle": 2.93 },
					{ "time": 13.3796, "angle": 60.37 }
				]
			},
			"arm": {
				"rotate": [
					{ "time": 0, "angle": 18.02 },
					{ "time": 3.3449, "angle": -0.47 },
					{ "time": 6.6898, "angle": -15.81 },
					{ "time": 10.0347, "angle": -0.47 },
					{ "time": 13.3796, "angle": 18.02 }
				]
			}
		},
		"slots": {
			"eyes_r": {
				"attachment": [
					{ "time": 0, "name": null },
					{ "time": 4.2814, "name": "eyes_l" },
					{ "time": 4.549, "name": null },
					{ "time": 12.1754, "name": "eyes_r" },
					{ "time": 12.443, "name": null },
					{ "time": 13.3796, "name": null }
				]
			},
			"hand": {
				"attachment": [
					{ "time": 0, "name": null },
					{ "time": 3.3449, "name": "DimmBro1/arm sep/hand_left" },
					{ "time": 10.0347, "name": null },
					{ "time": 13.3796, "name": null }
				]
			},
			"hand_right": {
				"attachment": [
					{ "time": 3.3449, "name": null },
					{ "time": 10.0347, "name": "DimmBro1/arm sep/hand_right" }
				]
			},
			"head_r": {
				"attachment": [
					{ "time": 0, "name": "head_r" },
					{ "time": 3.3449, "name": "head_l" },
					{ "time": 10.0347, "name": "head_r" },
					{ "time": 13.3796, "name": "head_r" }
				]
			},
			"main bod": {
				"attachment": [
					{ "time": 3.3333, "name": null },
					{ "time": 10.1, "name": "DimmBro1/arm sep/main bod" }
				]
			},
			"main bod 2": {
				"attachment": [
					{ "time": 0, "name": null },
					{ "time": 3.34, "name": "DimmBro1/arm sep/main bod 2" },
					{ "time": 10.1, "name": null }
				]
			}
		}
	}
}
};
this.AtlasData = 
"\n" +
"dimmbro_1.png\n" +
"format: RGBA8888\n" +
"filter: Linear,Linear\n" +
"repeat: none\n" +
"DimmBro1/arm sep/arm_gen\n" +
"  rotate: false\n" +
"  xy: 104, 2\n" +
"  size: 26, 60\n" +
"  orig: 128, 128\n" +
"  offset: 41, 10\n" +
"  index: -1\n" +
"DimmBro1/arm sep/hand_left\n" +
"  rotate: false\n" +
"  xy: 2, 10\n" +
"  size: 50, 40\n" +
"  orig: 128, 128\n" +
"  offset: 13, 5\n" +
"  index: -1\n" +
"DimmBro1/arm sep/hand_right\n" +
"  rotate: false\n" +
"  xy: 101, 64\n" +
"  size: 50, 40\n" +
"  orig: 128, 128\n" +
"  offset: 41, 5\n" +
"  index: -1\n" +
"DimmBro1/arm sep/main bod\n" +
"  rotate: false\n" +
"  xy: 2, 182\n" +
"  size: 97, 128\n" +
"  orig: 128, 128\n" +
"  offset: 22, 0\n" +
"  index: -1\n" +
"DimmBro1/arm sep/main bod 2\n" +
"  rotate: false\n" +
"  xy: 2, 52\n" +
"  size: 97, 128\n" +
"  orig: 128, 128\n" +
"  offset: 1, 0\n" +
"  index: -1\n" +
"DimmBro1/arm sep/shoulder_gen\n" +
"  rotate: false\n" +
"  xy: 132, 25\n" +
"  size: 24, 37\n" +
"  orig: 128, 128\n" +
"  offset: 40, 60\n" +
"  index: -1\n" +
"eyes_l\n" +
"  rotate: false\n" +
"  xy: 153, 78\n" +
"  size: 48, 26\n" +
"  orig: 256, 256\n" +
"  offset: 91, 134\n" +
"  index: -1\n" +
"eyes_r\n" +
"  rotate: false\n" +
"  xy: 54, 24\n" +
"  size: 48, 26\n" +
"  orig: 256, 256\n" +
"  offset: 117, 134\n" +
"  index: -1\n" +
"head_l\n" +
"  rotate: false\n" +
"  xy: 101, 209\n" +
"  size: 103, 101\n" +
"  orig: 256, 256\n" +
"  offset: 74, 99\n" +
"  index: -1\n" +
"head_r\n" +
"  rotate: false\n" +
"  xy: 101, 106\n" +
"  size: 103, 101\n" +
"  orig: 256, 256\n" +
"  offset: 79, 99\n" +
"  index: -1\n" +
"\n";
}
