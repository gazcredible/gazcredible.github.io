var title = function() { 
this.Skeleton = {
"bones": [
	{ "name": "root" },
	{ "name": "eyes 1", "parent": "root", "x": -182.94, "y": 88.43 },
	{ "name": "eyes 2", "parent": "root", "x": 198.14, "y": 84.45, "rotation": 20.13 }
],
"slots": [
	{ "name": "title", "bone": "root", "attachment": "title" },
	{ "name": "eyes", "bone": "eyes 2", "attachment": "eyes" },
	{ "name": "eyes copy", "bone": "eyes 1", "attachment": "eyes copy" }
],
"skins": {
	"default": {
		"eyes": {
			"eyes": { "x": 18.9, "y": -74.68, "scaleX": 1.557, "scaleY": 1.557, "rotation": 2.87, "width": 512, "height": 512 }
		},
		"eyes copy": {
			"eyes copy": { "x": -47.76, "y": -52.73, "scaleX": 1.554, "scaleY": 1.554, "rotation": -27.47, "width": 512, "height": 512 }
		},
		"title": {
			"title": { "width": 800, "height": 600 }
		}
	}
},
"animations": {
	"blink": {
		"slots": {
			"eyes": {
				"attachment": [
					{ "time": 0, "name": null },
					{ "time": 0.5, "name": "eyes" },
					{ "time": 0.5666, "name": null },
					{ "time": 1.2, "name": "eyes" },
					{ "time": 1.2666, "name": null }
				]
			},
			"eyes copy": {
				"attachment": [
					{ "time": 0, "name": null },
					{ "time": 0.1333, "name": "eyes copy" },
					{ "time": 0.2, "name": null },
					{ "time": 1, "name": "eyes copy" },
					{ "time": 1.0666, "name": null }
				]
			}
		}
	},
	"drop": {
		"bones": {
			"root": {
				"rotate": [

					{ "time": 0, "angle":0 },
					{ "time": 0.4642, "angle": 0 },
					{ "time": 0.6164, "angle": 0 },
					{ "time": 0.7714, "angle": 0 }

				],
				"translate": [
					{ "time": 0, "x": 0, "y": 781.07 },
					{ "time": 0.4642, "x": 0, "y": 20.56 },
					{ "time": 0.5434, "x": 0, "y": 102.65 },
					{ "time": 0.6164, "x": 0, "y": 9.61 },
					{ "time": 0.6985, "x": 0, "y": 45.39 },
					{ "time": 0.7714, "x": 0, "y": 5.83 }
				]
			}
		}
	}
}
};
this.AtlasData = 
"\n" +
"title.png\n" +
"format: RGBA8888\n" +
"filter: Linear,Linear\n" +
"repeat: none\n" +
"eyes\n" +
"  rotate: false\n" +
"  xy: 609, 350\n" +
"  size: 50, 35\n" +
"  orig: 512, 512\n" +
"  offset: 226, 279\n" +
"  index: -1\n" +
"eyes copy\n" +
"  rotate: false\n" +
"  xy: 609, 313\n" +
"  size: 50, 35\n" +
"  orig: 512, 512\n" +
"  offset: 236, 279\n" +
"  index: -1\n" +
"title\n" +
"  rotate: false\n" +
"  xy: 2, 2\n" +
"  size: 605, 383\n" +
"  orig: 800, 600\n" +
"  offset: 106, 111\n" +
"  index: -1\n" +
"\n";
}
