var gradient = {

	create: function (arrayOfStops,arrayOfColors,inputColorType){		
		var inputColorType = inputColorType || 'rgba';
		var mapObj = [];
		if (arrayOfStops.length !== arrayOfColors.length) throw new Error('Error in gradientMap.create() - length of stops array !== length of colors array');
		if (arrayOfStops.length < 2) throw new Error('Must contain at least two stops to create gradient!');
		if (['hex','rgb','rgba','htmlcolor'].indexOf(inputColorType) === -1) throw new Error('inputColorType must be "hex", "rgb", or "rgba"');
		
		for (var i=0;i<arrayOfStops.length-1;i++) {
			var startColor = arrayOfColors[i];
			var endColor = arrayOfColors[i+1];

			if (inputColorType === 'rgb') {
				startColor = this.rgbToRgba(startColor);
				endColor = this.rgbToRgba(endColor);
			} else if (inputColorType === 'hex') {
				startColor = this.hexToRgba(startColor);
				endColor = this.hexToRgba(endColor);
			} else if (inputColorType === 'htmlcolor') {
				startColor = this.htmlColorToRgba(startColor);
				endColor = this.htmlColorToRgba(endColor);
			}
			mapObj.push({
				'start': arrayOfStops[i],
				'end': arrayOfStops[i+1],
				'startColor': startColor,
				'endColor': endColor
			});
		}
		
		return mapObj;
	},
	
	
	
	valToColor: function (val,mapObj,outputColorType) {
		var outputColorType = outputColorType || 'rgba';
		if (['hex','rgb','rgba'].indexOf(outputColorType) === -1) throw new Error('outputColorType must be "hex", "rgb", or "rgba"');
		
		for (var i=0;i<mapObj.length;i++) {
			if ( val < mapObj[i].start || val > mapObj[i].end) continue;

			var matchingRow = mapObj[i];
			break;
		}
		if (matchingRow == null) throw new Error('The value ' + val + ' does not lie within the min and max range of the gradient object (this happens if, e.g., your gradient has value stops of [1,50,100] and you tried to find the color for 101.');
						
		return this.twoPointGradient(val,matchingRow.start,matchingRow.end,matchingRow.startColor,matchingRow.endColor,outputColorType);
	},

	
	
	twoPointGradient: function(val,start,end,startColor,endColor,outputColorType) {
		var rgbaArr = [];
		var rgba = null;
		//scale [start,val,end] to [0,norm,1]
		var norm = (val-start)/(end-start);
		startColor = this.splitRgba(startColor);
		endColor = this.splitRgba(endColor);
				
		for(var i=0;i<=2;i++) {
		  rgbaArr[i] = parseInt( ((endColor[i] - startColor[i]) * norm).toFixed(0)) + startColor[i];
		}
		rgbaArr[3] = parseFloat( ((endColor[3] - startColor[3]) * norm + startColor[3]).toFixed(2) );
		
		rgba = this.joinRgba(rgbaArr);

		if (outputColorType === 'rgba') return rgba;
		if (outputColorType === 'rgb') return this.rgbaToRgb(rgba);
		if (outputColorType === 'hex') return this.rgbaToHex(rgba);
	},
	
	
	splitRgba: function(rgba) {
		var fromArr = rgba.replace(/[^\d,.-]/g, '').split(',');
		var resArr = [];
		
		if (fromArr.length !== 4) throw new Error('RGBA not 4 elements');
		for (i=0;i<=2;i++) {
			if (fromArr[i] < 0 || fromArr[i] > 255) throw new Error('RGB value not between 0 and 255: ' + rgba);
			resArr[i] = parseInt(fromArr[i]);
		}
		
		if (fromArr[3] < 0 || fromArr[3] > 1) throw new Error('Alpha value not between 0 and 1');
		resArr[3] = parseFloat(fromArr[3]);
		return resArr;
	},
	
	joinRgba: function(rgbaArr) {
		if (rgbaArr.length !== 4) throw new Error('RGBA not 4 elements');
		return 'rgba(' + rgbaArr.join(',') + ')';
	},
	
	
	
	rgbToRgba: function(rgb) {
		var rgbArr = rgb.replace(/[^\d,.-]/g, '').split(',');
		if (rgbArr.length !== 3) throw new Error('RGB not 3 elements');
		for (var i=0;i<=2;i++) {
			if (rgbArr[i] < 0 || rgbArr[i] > 255) throw new Error('RGB value not between 0 and 255: ' + rgb);
			rgbArr[i] = parseInt(rgbArr[i]);
		}
		rgbArr.push(1.0);
		return this.joinRgba(rgbArr);
	},
	
	hexToRgba: function(hex) {
		var c;
		if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
			c= hex.substring(1).split('');
			if(c.length== 3){
				c= [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c= '0x'+c.join('');
			return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
		}
		throw new Error('Bad Hex');
	},

	
	htmlColorToRgba: function(htmlColor) {
		var htmlMap = this.getHtmlNames();
		if ( htmlMap.hasOwnProperty(htmlColor.toLowerCase()) === false ) throw new Error('Invalid HTML Color Name: ' + htmlColor);

		return this.hexToRgba(htmlMap[htmlColor.toLowerCase()]);
	},

	
	rgbaToHex: function(rgba) {
		var rgbaArr = this.splitRgba(rgba);	
		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		return "#" + hex(rgbaArr[0]) + hex(rgbaArr[1]) + hex(rgbaArr[2]);
	},

	
	rgbaToRgb: function(rgba) {
		var rgbaArr = this.splitRgba(rgba);
		rgbaArr.pop();
		return 'rgb(' + rgbaArr.join(',') + ')';
	},
	
	
	/* 
	From https://www.w3schools.com/Colors/colors_names.asp
	*/
	getHtmlNames: function() {
		return {
			"aliceblue":"#F0F8FF",
			"antiquewhite":"#FAEBD7",
			"aqua":"#00FFFF",
			"aquamarine":"#7FFFD4",
			"azure":"#F0FFFF",
			"beige":"#F5F5DC",
			"bisque":"#FFE4C4",
			"black":"#000000",
			"blanchedalmond":"#FFEBCD",
			"blue":"#0000FF",
			"blueviolet":"#8A2BE2",
			"brown":"#A52A2A",
			"burlywood":"#DEB887",
			"cadetblue":"#5F9EA0",
			"chartreuse":"#7FFF00",
			"chocolate":"#D2691E",
			"coral":"#FF7F50",
			"cornflowerblue":"#6495ED",
			"cornsilk":"#FFF8DC",
			"crimson":"#DC143C",
			"cyan":"#00FFFF",
			"darkblue":"#00008B",
			"darkcyan":"#008B8B",
			"darkgoldenrod":"#B8860B",
			"darkgray":"#A9A9A9",
			"darkgrey":"#A9A9A9",
			"darkgreen":"#006400",
			"darkkhaki":"#BDB76B",
			"darkmagenta":"#8B008B",
			"darkolivegreen":"#556B2F",
			"darkorange":"#FF8C00",
			"darkorchid":"#9932CC",
			"darkred":"#8B0000",
			"darksalmon":"#E9967A",
			"darkseagreen":"#8FBC8F",
			"darkslateblue":"#483D8B",
			"darkslategray":"#2F4F4F",
			"darkslategrey":"#2F4F4F",
			"darkturquoise":"#00CED1",
			"darkviolet":"#9400D3",
			"deeppink":"#FF1493",
			"deepskyblue":"#00BFFF",
			"dimgray":"#696969",
			"dimgrey":"#696969",
			"dodgerblue":"#1E90FF",
			"firebrick":"#B22222",
			"floralwhite":"#FFFAF0",
			"forestgreen":"#228B22",
			"fuchsia":"#FF00FF",
			"gainsboro":"#DCDCDC",
			"ghostwhite":"#F8F8FF",
			"gold":"#FFD700",
			"goldenrod":"#DAA520",
			"gray":"#808080",
			"grey":"#808080",
			"green":"#008000",
			"greenyellow":"#ADFF2F",
			"honeydew":"#F0FFF0",
			"hotpink":"#FF69B4",
			"indianred":"#CD5C5C",
			"indigo":"#4B0082",
			"ivory":"#FFFFF0",
			"khaki":"#F0E68C",
			"lavender":"#E6E6FA",
			"lavenderblush":"#FFF0F5",
			"lawngreen":"#7CFC00",
			"lemonchiffon":"#FFFACD",
			"lightblue":"#ADD8E6",
			"lightcoral":"#F08080",
			"lightcyan":"#E0FFFF",
			"lightgoldenrodyellow":"#FAFAD2",
			"lightgray":"#D3D3D3",
			"lightgrey":"#D3D3D3",
			"lightgreen":"#90EE90",
			"lightpink":"#FFB6C1",
			"lightsalmon":"#FFA07A",
			"lightseagreen":"#20B2AA",
			"lightskyblue":"#87CEFA",
			"lightslategray":"#778899",
			"lightslategrey":"#778899",
			"lightsteelblue":"#B0C4DE",
			"lightyellow":"#FFFFE0",
			"lime":"#00FF00",
			"limegreen":"#32CD32",
			"linen":"#FAF0E6",
			"magenta":"#FF00FF",
			"maroon":"#800000",
			"mediumaquamarine":"#66CDAA",
			"mediumblue":"#0000CD",
			"mediumorchid":"#BA55D3",
			"mediumpurple":"#9370DB",
			"mediumseagreen":"#3CB371",
			"mediumslateblue":"#7B68EE",
			"mediumspringgreen":"#00FA9A",
			"mediumturquoise":"#48D1CC",
			"mediumvioletred":"#C71585",
			"midnightblue":"#191970",
			"mintcream":"#F5FFFA",
			"mistyrose":"#FFE4E1",
			"moccasin":"#FFE4B5",
			"navajowhite":"#FFDEAD",
			"navy":"#000080",
			"oldlace":"#FDF5E6",
			"olive":"#808000",
			"olivedrab":"#6B8E23",
			"orange":"#FFA500",
			"orangered":"#FF4500",
			"orchid":"#DA70D6",
			"palegoldenrod":"#EEE8AA",
			"palegreen":"#98FB98",
			"paleturquoise":"#AFEEEE",
			"palevioletred":"#DB7093",
			"papayawhip":"#FFEFD5",
			"peachpuff":"#FFDAB9",
			"peru":"#CD853F",
			"pink":"#FFC0CB",
			"plum":"#DDA0DD",
			"powderblue":"#B0E0E6",
			"purple":"#800080",
			"rebeccapurple":"#663399",
			"red":"#FF0000",
			"rosybrown":"#BC8F8F",
			"royalblue":"#4169E1",
			"saddlebrown":"#8B4513",
			"salmon":"#FA8072",
			"sandybrown":"#F4A460",
			"seagreen":"#2E8B57",
			"seashell":"#FFF5EE",
			"sienna":"#A0522D",
			"silver":"#C0C0C0",
			"skyblue":"#87CEEB",
			"slateblue":"#6A5ACD",
			"slategray":"#708090",
			"slategrey":"#708090",
			"snow":"#FFFAFA",
			"springgreen":"#00FF7F",
			"steelblue":"#4682B4",
			"tan":"#D2B48C",
			"teal":"#008080",
			"thistle":"#D8BFD8",
			"tomato":"#FF6347",
			"turquoise":"#40E0D0",
			"violet":"#EE82EE",
			"wheat":"#F5DEB3",
			"white":"#FFFFFF",
			"whitesmoke":"#F5F5F5",
			"yellow":"#FFFF00",
			"yellowgreen":"#9ACD32"
		}
	}
	
}
