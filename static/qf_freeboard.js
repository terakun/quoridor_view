/*
qf_freeboard.js
Copyright (c) 2014 Quoridor Fansite Webmaster
Released under the MIT license
http://opensource.org/licenses/mit-license.php
*/

jQuery(function(){
	var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	var b64idxs = [];
	var tempI;
	for(tempI=0; tempI<b64chars.length; tempI++){
		b64idxs[b64chars.charAt(tempI)] = tempI;
	}
	var aichars = 'abcdefghi';

	function createWholeBoard(idx, el){
		var bs = parseInt($(el).data('boardsize'), 10);

		var qfObj = {};
		initqfObj(qfObj);

		createAllHTML(el, bs);
		adjustAllEvents(el, bs, qfObj);
	}

	function createAllHTML(el, bs){
		var i;
		var tMargin = parseInt(bs/3, 10);

		var grids = '';
		var grids2 = '';
		for(i=0; i<81; i++){
			grids += '<div class="qf_board_grid" style="width: '+(4*bs)+'px; height: '+(4*bs)+'px; top: '+(5*bs*(8-parseInt(i/9, 10)))+'px; left: '+(5*bs*(i%9))+'px;"></div>';
			grids2 += '<div class="qf_board_grid2" style="width: '+(4*bs)+'px; height: '+(4*bs)+'px; top: '+(5*bs*(8-parseInt(i/9, 10)))+'px; left: '+(5*bs*(i%9))+'px;"></div>';
		}

		var hSpaces = '';
		var vSpaces = '';
		var whWalls = '';
		var wvWalls = '';
		var bhWalls = '';
		var bvWalls = '';
		for(i=0; i<64; i++){
			hSpaces += '<div class="qf_board_space qf_board_hspace" style="width: '+(4*bs)+'px; height: '+(bs)+'px; top: '+(5*bs*(7-parseInt(i/8, 10))+4*bs)+'px; left: '+(5*bs*(i%8))+'px;"></div>';
			vSpaces += '<div class="qf_board_space qf_board_vspace" style="width: '+(bs)+'px; height: '+(4*bs)+'px; top: '+(5*bs*(7-parseInt(i/8, 10))+5*bs)+'px; left: '+(5*bs*(i%8)+4*bs)+'px;"></div>';
			whWalls += '<div class="qf_wall qf_wwall qf_hwall" style="width: '+(9*bs)+'px; height: '+(bs)+'px; top: '+(5*bs*(7-parseInt(i/8, 10))+4*bs)+'px; left: '+(5*bs*(i%8))+'px; opacity: 0; -webkit-transform: scale(3); -moz-transform: scale(3); -ms-transform: scale(3); -o-transform: scale(3); transform: scale(3);"></div>';
			wvWalls += '<div class="qf_wall qf_wwall qf_vwall" style="width: '+(bs)+'px; height: '+(9*bs)+'px; top: '+(5*bs*(7-parseInt(i/8, 10)))+'px; left: '+(5*bs*(i%8)+4*bs)+'px; opacity: 0; -webkit-transform: scale(3); -moz-transform: scale(3); -ms-transform: scale(3); -o-transform: scale(3); transform: scale(3);"></div>';
			bhWalls += '<div class="qf_wall qf_bwall qf_hwall" style="width: '+(9*bs)+'px; height: '+(bs)+'px; top: '+(5*bs*(7-parseInt(i/8, 10))+4*bs)+'px; left: '+(5*bs*(i%8))+'px; opacity: 0; -webkit-transform: scale(3); -moz-transform: scale(3); -ms-transform: scale(3); -o-transform: scale(3); transform: scale(3);"></div>';
			bvWalls += '<div class="qf_wall qf_bwall qf_vwall" style="width: '+(bs)+'px; height: '+(9*bs)+'px; top: '+(5*bs*(7-parseInt(i/8, 10)))+'px; left: '+(5*bs*(i%8)+4*bs)+'px; opacity: 0; -webkit-transform: scale(3); -moz-transform: scale(3); -ms-transform: scale(3); -o-transform: scale(3); transform: scale(3);"></div>';
		}

		var xChars = '';
		var yChars = '';
		for(i=0; i<9; i++){
			xChars += '<div class="qf_char qf_xchar" style="width: '+(2*bs)+'px; height: '+(2*bs)+'px; top: '+(49*bs)+'px; left: '+(5*bs*i+5*bs)+'px; font-size: '+(2*bs)+'px;">'+(aichars.charAt(i))+'</div>';
			yChars += '<div class="qf_char qf_xchar" style="width: '+(2*bs)+'px; height: '+(2*bs)+'px; top: '+(5*bs*i+5*bs)+'px; left: '+(bs)+'px; font-size: '+(2*bs)+'px;">'+(9-i)+'</div>';
		}

		var allTags = '\
			<div class="qf_gameboard" style="width: '+(52*bs)+'px; height: '+(52*bs)+'px;">\
				'+ xChars + yChars +'\
				<div class ="qf_inner_gameboard" style="width: '+(44*bs)+'px; height: '+(44*bs)+'px; top: '+(4*bs)+'px; left: '+(4*bs)+'px;">\
					'+ grids +'\
					<div class="qf_piece qf_piece_white" style="width: '+(4*bs-2*tMargin)+'px; height: '+(4*bs-2*tMargin)+'px; top: '+(40*bs+tMargin)+'px; left: '+(20*bs+tMargin)+'px;"></div>\
					<div class="qf_piece qf_piece_black" style="width: '+(4*bs-2*tMargin)+'px; height: '+(4*bs-2*tMargin)+'px; top: '+(tMargin)+'px; left: '+(20*bs+tMargin)+'px;"></div>\
					'+ whWalls + wvWalls + bhWalls + bvWalls +'\
					<div class="qf_piece qf_piece_white2" style="width: '+(4*bs-2*tMargin)+'px; height: '+(4*bs-2*tMargin)+'px; top: '+(0)+'px; left: '+(0)+'px; display: none;"></div>\
					<div class="qf_piece qf_piece_black2" style="width: '+(4*bs-2*tMargin)+'px; height: '+(4*bs-2*tMargin)+'px; top: '+(0)+'px; left: '+(0)+'px; display: none;"></div>\
					<div class="qf_wall qf_wwall2 qf_hwall" style="display: none; width: '+(9*bs)+'px; height: '+(bs)+'px; top: '+(0)+'px; left: '+(0)+'px;"></div>\
					<div class="qf_wall qf_wwall2 qf_vwall" style="display: none; width: '+(bs)+'px; height: '+(9*bs)+'px; top: '+(0)+'px; left: '+(0)+'px;"></div>\
					<div class="qf_wall qf_bwall2 qf_hwall" style="display: none; width: '+(9*bs)+'px; height: '+(bs)+'px; top: '+(0)+'px; left: '+(0)+'px;"></div>\
					<div class="qf_wall qf_bwall2 qf_vwall" style="display: none; width: '+(bs)+'px; height: '+(9*bs)+'px; top: '+(0)+'px; left: '+(0)+'px;"></div>\
					'+ grids2 + hSpaces + vSpaces +'\
				</div>\
			</div>\
			<div class="qf_infobar" style="width: '+(52*bs)+'px; height: '+(5*bs)+'px; top: '+(52*bs)+'px; left: '+(0)+'px; border-bottom-width: '+(parseInt(bs/3, 10))+'px;">\
				<div class="qf_info_text qf_info_turn" style="width: '+(6*bs)+'px; height: '+(3*bs)+'px; top: '+(34)+'%; left: '+(6*bs)+'px; font-size: '+(2*bs)+'px;">TURN</div>\
				<div class="qf_info_text_num qf_info_turn_num" style="width: '+(6*bs)+'px; height: '+(4*bs)+'px; top: '+(bs)+'px; left: '+(12*bs)+'px; font-size: '+(3*bs)+'px;">1</div>\
				<div class="qf_info_text qf_info_white" style="width: '+(8*bs)+'px; height: '+(3*bs)+'px; top: '+(34)+'%; left: '+(20*bs)+'px; font-size: '+(2*bs)+'px;">WHITE</div>\
				<div class="qf_info_text_num qf_info_white_num" style="width: '+(5*bs)+'px; height: '+(4*bs)+'px; top: '+(bs)+'px; left: '+(28*bs)+'px; font-size: '+(3*bs)+'px;">10</div>\
				<div class="qf_info_text qf_info_black" style="width: '+(8*bs)+'px; height: '+(3*bs)+'px; top: '+(34)+'%; left: '+(34*bs)+'px; font-size: '+(2*bs)+'px;">BLACK</div>\
				<div class="qf_info_text_num qf_info_black_num" style="width: '+(5*bs)+'px; height: '+(4*bs)+'px; top: '+(bs)+'px; left: '+(42*bs)+'px; font-size: '+(3*bs)+'px;">10</div>\
			</div>\
			<div class="qf_controlpanel" style="width: '+(10*bs)+'px; height: '+(57*bs)+'px; top: '+(0)+'px; left: '+(52*bs)+'px;">\
				<button class="qf_control_button qf_b_back" style="width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(4*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">BACK</button>\
				<button class="qf_control_button qf_b_next" style="width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(9*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">NEXT</button>\
				<button class="qf_control_button qf_b_reset" style="width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(14*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">RESET</button>\
				<button class="qf_control_button qf_b_inverse" style="width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(19*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">INV</button>\
				<button class="qf_control_button qf_b_lastmove" style="width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(24*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">LM</button>\
				<button class="qf_control_button qf_b_gray" style="width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(29*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">WALL</button>\
				<button class="qf_control_button qf_b_snap" style="width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(34*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">SNAP</button>\
				<button class="qf_control_button qf_b_record" style="width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(39*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">REC</button>\
				<button class="qf_control_button qf_b_input" style="width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(44*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">INPUT</button>\
				<button class="qf_control_button qf_cb_cover qf_b_back_c" style="width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(4*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">BACK</button>\
				<button class="qf_control_button qf_cb_cover qf_b_next_c" style="width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(9*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">NEXT</button>\
				<button class="qf_control_button qf_cb_cover qf_b_reset_c" style="display: none; width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(14*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">RESET</button>\
				<button class="qf_control_button qf_cb_cover qf_b_inverse_c" style="display: none; width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(19*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">INV</button>\
				<button class="qf_control_button qf_cb_cover qf_b_lastmove_c" style="display: none; width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(24*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">LM</button>\
				<button class="qf_control_button qf_cb_cover qf_b_gray_c" style="display: none; width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(29*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">WALL</button>\
				<button class="qf_control_button qf_cb_cover qf_b_snap_c" style="display: none; width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(34*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">SNAP</button>\
				<button class="qf_control_button qf_cb_cover qf_b_record_c" style="display: none; width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(39*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">REC</button>\
				<button class="qf_control_button qf_cb_cover qf_b_input_c" style="display: none; width: '+(8*bs)+'px; height: '+(4*bs)+'px; top: '+(44*bs)+'px; left: '+(2*bs)+'px; font-size: '+(parseInt((5*bs)/3, 10))+'px;">INPUT</button>\
			</div>\
			<div class="qf_textfield" style="width: '+(52*bs)+'px; height: '+(5*bs)+'px; top: '+(59*bs)+'px; left: '+(0)+'px;">\
				<textarea wrap="soft" class="qf_textarea" style="width: '+(52*bs-2*parseInt(bs/2, 10)-2)+'px; height: '+(5*bs-2*parseInt(bs/2, 10)-2)+'px; top: '+(0)+'px; left: '+(0)+'px; padding: '+(parseInt(bs/2, 10))+'px;"></textarea>\
			</div>\
		';

		$(el).css({
			width: 62*bs,
			height: 64*bs
		}).append(allTags);
	}

	function adjustAllEvents(el, bs, qfObj) {
		var t = $(el);
		var tMargin = parseInt(bs/3, 10);

		adjustGBEvents(el, bs, qfObj);

		t.find('.qf_b_back').on('click', function(){
			toBTbyBACK(el, bs, qfObj);
		});
		t.find('.qf_b_next').on('click', function(){
			toNTbyNEXT(el, bs, qfObj);
		});
		t.find('.qf_b_reset').on('click', function(){
			var targetLM;
			//highlight
			if((qfObj.state.lastmove.pw !== null) && (qfObj.highlight === true)){
				targetLM = seekHLTarget(el, qfObj);
				highlightOff(targetLM, bs);
			}

			//piece
			t.find('.qf_piece_white').css({
				top: 40*bs+tMargin + 'px',
				left: 20*bs+tMargin + 'px'
			});
			t.find('.qf_piece_black').css({
				top: tMargin + 'px',
				left: 20*bs+tMargin + 'px'
			});

			//wall
			t.find('.qf_wwall, .qf_bwall').css({
				'opacity': '0',
				'-webkit-transform': 'scale(3)',
				'-moz-transform': 'scale(3)',
				'-ms-transform': 'scale(3)',
				'-o-transform': 'scale(3)',
				'transform': 'scale(3)'
			});

			//infobar
			t.find('.qf_info_turn_num').html('1');
			t.find('.qf_info_white_num').html('10');
			t.find('.qf_info_black_num').html('10');
			//control pannel
			t.find('.qf_b_back_c').css('display', 'block');
			t.find('.qf_b_next_c').css('display', 'block');
			//rec end
			if(qfObj.recMode){
				qfObj.recMode = false;
				t.find('.qf_b_record').removeClass('qf_b_record_on');
				t.find('.qf_b_back_c').css('display', 'none');
				if(qfObj.record.currentNum - qfObj.record.recStartNum > 0){
					t.find('.qf_b_back_c').css('display', 'none');
				}
			}

			//data reset and restart
			resetqfObj(qfObj);
			adjustGBEvents(el, bs, qfObj);
		});

		t.find('.qf_b_inverse').on('click', function(){
			if(qfObj.inv === false){
				t.find('.qf_gameboard').addClass('qf_boardInversed');
				t.find('.qf_char').addClass('qf_boardInversed');
				qfObj.inv = true;
			} else {
				t.find('.qf_gameboard').removeClass('qf_boardInversed');
				t.find('.qf_char').removeClass('qf_boardInversed');
				qfObj.inv = false;
			}
		});

		t.find('.qf_b_lastmove').on('click', function(){
			if(qfObj.state.lastmove.pw === null){
				qfObj.highlight = !(qfObj.highlight);
				return;
			}

			var targetPW = seekHLTarget(el, qfObj);

			if(qfObj.highlight === false){
				highlightOn(targetPW, bs);
				qfObj.highlight = true;
			} else {
				highlightOff(targetPW, bs);
				qfObj.highlight = false;
			}
		}).trigger('click');

		t.find('.qf_b_gray').on('click', function(){
			if(qfObj.gray === false){
				t.find('.qf_wwall, .qf_bwall').addClass('qf_gwall');
				t.find('.qf_wwall2, .qf_bwall2').addClass('qf_gwall2');
				qfObj.gray = true;
			} else {
				t.find('.qf_wwall, .qf_bwall').removeClass('qf_gwall');
				t.find('.qf_wwall2, .qf_bwall2').removeClass('qf_gwall2');
				qfObj.gray = false;
			}		
		}).trigger('click');

		t.find('.qf_b_snap').on('click', function(){
			var qfCode = base64Encode(el, qfObj);
			t.find('.qf_textarea').val(qfCode);
		});

		t.find('.qf_b_record').on('click', function(){
			var i;
			if(qfObj.recMode === false){
				//rec start!
				if(qfObj.hasState === false){
					qfObj.rState.hasState = false;
				} else {
					qfObj.rState.hasState = true;
					qfObj.rState.wPiece = qfObj.state.wPiece;
					qfObj.rState.bPiece = qfObj.state.bPiece;
					qfObj.rState.whWallNum = 0;
					qfObj.rState.wvWallNum = 0;
					qfObj.rState.bhWallNum = 0;
					qfObj.rState.bvWallNum = 0;
					for(i=0; i<64; i++){
						if(qfObj.state.hSpaces[i]){
							if(t.find('.qf_hwall.qf_wwall').eq(i).css('opacity') === '1'){
								qfObj.rState.whWalls[qfObj.rState.whWallNum] = i;
								qfObj.rState.whWallNum += 1;
							} else {
								qfObj.rState.bhWalls[qfObj.rState.bhWallNum] = i;
								qfObj.rState.bhWallNum += 1;
							}
						}
						if(qfObj.state.vSpaces[i]){
							if(t.find('.qf_vwall.qf_wwall').eq(i).css('opacity') === '1'){
								qfObj.rState.wvWalls[qfObj.rState.wvWallNum] = i;
								qfObj.rState.wvWallNum += 1;
							} else {
								qfObj.rState.bvWalls[qfObj.rState.bvWallNum] = i;
								qfObj.rState.bvWallNum += 1;
							}
						}
					}
					qfObj.rState.lastmove.wb = qfObj.state.lastmove.wb;
					qfObj.rState.lastmove.pw = qfObj.state.lastmove.pw;
					qfObj.rState.lastmove.place = qfObj.state.lastmove.place;
					qfObj.rState.turnNum = qfObj.state.turnNum;
				}
				qfObj.record.recStartNum = qfObj.record.currentNum;

				qfObj.recMode = true;
				$(this).addClass('qf_b_record_on');
				t.find('.qf_b_back_c').css('display', 'block');
			} else {
				//rec end!
				if(qfObj.record.currentNum - qfObj.record.recStartNum > 0){
					var qfCode = base64Encode(el, qfObj);
					t.find('.qf_textarea').val(qfCode);
					t.find('.qf_b_back_c').css('display', 'none');
				}

				qfObj.recMode = false;
				$(this).removeClass('qf_b_record_on');
			}
		});

		t.find('.qf_b_input').on('click', function(){
			var qfCode = t.find('.qf_textarea').val();
			if(!(qfCode)){
				return;
			}

			var i, targetLM;
			var jqObjs = [];
			var jqObjNum = 0;

			sameLM = {};
			sameLM.pw = qfObj.state.lastmove.pw;
			sameLM.wb = qfObj.state.lastmove.wb;
			sameLM.place = qfObj.state.lastmove.place;
			t.find('.qf_b_reset').trigger('click');
			base64Decode(qfObj, qfCode);

			//piece
			t.find('.qf_piece_white').css({
				top: 5*bs*(8-parseInt(qfObj.state.wPiece/9, 10)) + tMargin +'px',
				left: 5*bs*(qfObj.state.wPiece%9) + tMargin +'px'
			});
			t.find('.qf_piece_black').css({
				top: 5*bs*(8-parseInt(qfObj.state.bPiece/9, 10)) + tMargin +'px',
				left: 5*bs*(qfObj.state.bPiece%9) + tMargin +'px'
			});

			//wall
			for(i=0; i<qfObj.state.whWallNum; i++){
				jqObjs[jqObjNum] = t.find('.qf_wwall.qf_hwall').eq(qfObj.fState.whWalls[i]);
				jqObjNum += 1;
			}
			for(i=0; i<qfObj.state.wvWallNum; i++){
				jqObjs[jqObjNum] = t.find('.qf_wwall.qf_vwall').eq(qfObj.fState.wvWalls[i])
				jqObjNum += 1;
			}
			for(i=0; i<qfObj.state.bhWallNum; i++){
				jqObjs[jqObjNum] = t.find('.qf_bwall.qf_hwall').eq(qfObj.fState.bhWalls[i])
				jqObjNum += 1;
			}
			for(i=0; i<qfObj.state.bvWallNum; i++){
				jqObjs[jqObjNum] = t.find('.qf_bwall.qf_vwall').eq(qfObj.fState.bvWalls[i])
				jqObjNum += 1;
			}

			for(i=0; i<jqObjNum; i++){
				jqObjs[i].css({
						'opacity': '1',
						'-webkit-transform': 'scale(1)',
						'-moz-transform': 'scale(1)',
						'-ms-transform': 'scale(1)',
						'-o-transform': 'scale(1)',
						'transform': 'scale(1)'
				});
			}

			//highlight
			if((qfObj.state.lastmove.pw !== null) && (qfObj.highlight === true)){
				targetLM = seekHLTarget(el, qfObj);
				highlightOn(targetLM, bs);
			}

			//infobar
			t.find('.qf_info_turn_num').html(qfObj.state.turnNum);
			t.find('.qf_info_white_num').html(10-(qfObj.state.whWallNum + qfObj.state.wvWallNum));
			t.find('.qf_info_black_num').html(10-(qfObj.state.bhWallNum + qfObj.state.bvWallNum));

			//control pannel
			t.find('.qf_b_back_c').css('display', 'block');
			if(qfObj.hasRecord){
				t.find('.qf_b_next_c').css('display', 'none');
			} else {
				t.find('.qf_b_next_c').css('display', 'block');
			}

			//restart
			adjustGBEvents(el, bs, qfObj);
		});
	}

	function adjustGBEvents(el, bs, qfObj){
		var t = $(el);
		var hs = t.find('.qf_board_hspace');
		var vs = t.find('.qf_board_vspace');
		var g = t.find('.qf_board_grid2');
		
		var i;
		var movableNums = [];
		var tMargin = parseInt(bs/3, 10);
		var turnP, turnWH, turnWV, pWallX, pWallY, wFlag;

		if((qfObj.state.lastmove.wb === null) || (qfObj.state.lastmove.wb === 1)){
			//white turn
			turnP = t.find('.qf_piece_white2');
			turnWH = t.find('.qf_wwall2.qf_hwall');
			turnWV = t.find('.qf_wwall2.qf_vwall');
			if((qfObj.state.whWallNum + qfObj.state.wvWallNum) < 10){
				wFlag = false;
			} else {
				wFlag = true;
			}
		} else {
			//black turn
			turnP = t.find('.qf_piece_black2');
			turnWH = t.find('.qf_bwall2.qf_hwall');
			turnWV = t.find('.qf_bwall2.qf_vwall');
			if((qfObj.state.bhWallNum + qfObj.state.bvWallNum) < 10){
				wFlag = false;
			} else {
				wFlag = true;
			}
		}

		//pieces adjust
		g.off();
		calMovableNums(qfObj, movableNums);

		for(i=0; i<movableNums.length; i++){
			g.eq(movableNums[i]).on({
				mouseenter: function(){
					var myNum = g.index(this);
					turnP.css({
						display: 'block',
						top: (5*bs*(8-parseInt(myNum/9, 10))+tMargin)+'px',
						left: (5*bs*(myNum%9)+tMargin)+'px'
					});
				},
				mouseleave: function(){
					turnP.css('display', 'none');
				},
				click: function(){
					turnP.css('display', 'none');
					var aMove = {};
					aMove.pw = 0;
					aMove.place = g.index(this);
					toNextTurn(el, bs, qfObj, aMove);
				}
			});
		}

		//walls adjust
		hs.off();
		vs.off();
		if(wFlag){
			return;
		}

		hs.on({
			mouseenter: function(){
				var idx = hs.index(this);
				turnWH.css({
					display: 'block',
					top: (5*bs*(7-parseInt(idx/8, 10))+4*bs)+'px',
					left: (5*bs*(idx%8))+'px'
				});
			},
			mouseleave: function(){
				turnWH.css('display', 'none');
			},
			click: function(){
				turnWH.css('display', 'none');
				var aMove = {};
				aMove.pw = 1;
				aMove.hv = 0;
				aMove.place = hs.index(this);
				toNextTurn(el, bs, qfObj, aMove);
			}
		});

		vs.on({
			mouseenter: function(){
				var idx = vs.index(this);
				turnWV.css({
					display: 'block',
					top: (5*bs*(7-parseInt(idx/8, 10)))+'px',
					left: (5*bs*(idx%8)+4*bs)+'px'
				});
			},
			mouseleave: function(){
				turnWV.css('display', 'none');
			},
			click: function(){
				turnWV.css('display', 'none');
				var aMove = {};
				aMove.pw = 1;
				aMove.hv = 1;
				aMove.place = vs.index(this);
				toNextTurn(el, bs, qfObj, aMove);
			}
		});

		for(i=0; i<64; i++){
			pWallX = i%8;
			pWallY = parseInt(i/8, 10);
			if(qfObj.state.hSpaces[i] === true){
				if(pWallX === 0){
					hs.eq(i+1).off();
				} else if(pWallX === 7){
					hs.eq(i-1).off();
				} else {
					hs.eq(i+1).off();
					hs.eq(i-1).off();
				}
				hs.eq(i).off();
				vs.eq(i).off();
			}
			if(qfObj.state.vSpaces[i] === true){
				if(pWallY === 0){
					vs.eq(i+8).off();
				} else if(pWallY === 7){
					vs.eq(i-8).off();
				} else {
					vs.eq(i+8).off();
					vs.eq(i-8).off();
				}
				vs.eq(i).off();
				hs.eq(i).off();
			}
		}
	}

	function toNextTurn(el, bs, qfObj, aMove){
		var t = $(el);
		var tMargin = parseInt(bs/3, 10);
		var moveTurn;
		var wallWBHV;
		var pieceWB;
		var targetLM;

		if((qfObj.state.lastmove.wb === null) || (qfObj.state.lastmove.wb === 1)){
			//white turn
			moveTurn = 0;
		} else {
			//black turn
			moveTurn = 1;
		}

		if((qfObj.state.lastmove.pw !== null) && (qfObj.highlight === true)){
			targetLM = seekHLTarget(el, qfObj);
			highlightOff(targetLM, bs);
		}

		qfObj.record.currentNum += 1;
		qfObj.record.moveNum = qfObj.record.currentNum;
		qfObj.record.moves[qfObj.record.currentNum-1] = {};
		qfObj.record.moves[qfObj.record.currentNum-1].wb = moveTurn;
		qfObj.record.moves[qfObj.record.currentNum-1].pw = aMove.pw;
		qfObj.record.moves[qfObj.record.currentNum-1].place = aMove.place;

		if(aMove.pw === 0){
			//piece
			if(moveTurn === 0){
				pieceWB = t.find('.qf_piece_white');
				qfObj.record.moves[qfObj.record.currentNum-1].backPlace = qfObj.state.wPiece;
				qfObj.state.wPiece = aMove.place;
			} else {
				pieceWB = t.find('.qf_piece_black');
				qfObj.record.moves[qfObj.record.currentNum-1].backPlace = qfObj.state.bPiece;
				qfObj.state.bPiece = aMove.place;
			}
			pieceWB.css({
				top: 5*bs*(8-parseInt(aMove.place/9, 10)) + tMargin +'px',
				left: 5*bs*(aMove.place%9) + tMargin +'px'
			});
		} else {
			//wall
			if((moveTurn === 0) && (aMove.hv === 0)){
				wallWBHV = t.find('.qf_wwall.qf_hwall');
				qfObj.state.whWallNum += 1;
				qfObj.state.hSpaces[aMove.place] = true;
				t.find('.qf_info_white_num').html(10-(qfObj.state.whWallNum+qfObj.state.wvWallNum));
			} else if((moveTurn === 0) && (aMove.hv === 1)){
				wallWBHV = t.find('.qf_wwall.qf_vwall');
				qfObj.state.wvWallNum += 1;
				qfObj.state.vSpaces[aMove.place] = true;
				t.find('.qf_info_white_num').html(10-(qfObj.state.whWallNum+qfObj.state.wvWallNum));
			} else if((moveTurn === 1) && (aMove.hv === 0)){
				wallWBHV = t.find('.qf_bwall.qf_hwall');
				qfObj.state.bhWallNum += 1;
				qfObj.state.hSpaces[aMove.place] = true;
				t.find('.qf_info_black_num').html(10-(qfObj.state.bhWallNum+qfObj.state.bvWallNum));
			} else if((moveTurn === 1) && (aMove.hv === 1)){
				wallWBHV = t.find('.qf_bwall.qf_vwall');
				qfObj.state.bvWallNum += 1;
				qfObj.state.vSpaces[aMove.place] = true;
				t.find('.qf_info_black_num').html(10-(qfObj.state.bhWallNum+qfObj.state.bvWallNum));
			}
			qfObj.record.moves[qfObj.record.currentNum-1].hv = aMove.hv;
			wallWBHV.eq(aMove.place).css({
				'opacity': '1',
				'-webkit-transform': 'scale(1)',
				'-moz-transform': 'scale(1)',
				'-ms-transform': 'scale(1)',
				'-o-transform': 'scale(1)',
				'transform': 'scale(1)'
			});
		}

		qfObj.hasState = true;
		qfObj.hasRecord = true;

		qfObj.state.lastmove.wb = moveTurn;
		qfObj.state.lastmove.pw = aMove.pw;
		qfObj.state.lastmove.place = aMove.place;

		if(qfObj.highlight === true){
			targetLM = seekHLTarget(el, qfObj);
			highlightOn(targetLM, bs);
		}

		qfObj.state.turnNum += 1;
		t.find('.qf_info_turn_num').html(qfObj.state.turnNum);

		if(qfObj.recMode === false){
			t.find('.qf_b_back_c').css('display', 'none');
		}
		t.find('.qf_b_next_c').css('display', 'block');

		adjustGBEvents(el, bs, qfObj);
	}

	function toBTbyBACK(el, bs, qfObj){
		var t = $(el);

		var tMargin = parseInt(bs/3, 10);
		var wallWBHV;
		var pieceWB;
		var targetLM;

		if(qfObj.highlight === true){
			targetLM = seekHLTarget(el, qfObj);
			highlightOff(targetLM, bs);
		}

		if(qfObj.record.moves[qfObj.record.currentNum-1].pw === 0){
			//piece
			if(qfObj.state.lastmove.wb === 0){
				pieceWB = t.find('.qf_piece_white');
				qfObj.state.wPiece = qfObj.record.moves[qfObj.record.currentNum-1].backPlace;
			} else {
				pieceWB = t.find('.qf_piece_black');
				qfObj.state.bPiece = qfObj.record.moves[qfObj.record.currentNum-1].backPlace;
			}
			pieceWB.css({
				top: 5*bs*(8-parseInt(qfObj.record.moves[qfObj.record.currentNum-1].backPlace/9, 10)) + tMargin +'px',
				left: 5*bs*(qfObj.record.moves[qfObj.record.currentNum-1].backPlace%9) + tMargin +'px'
			});
		} else {
			//wall
			if((qfObj.state.lastmove.wb === 0) && (qfObj.record.moves[qfObj.record.currentNum-1].hv === 0)){
				wallWBHV = t.find('.qf_wwall.qf_hwall');
				qfObj.state.whWallNum -= 1;
				qfObj.state.hSpaces[qfObj.record.moves[qfObj.record.currentNum-1].place] = false;
				t.find('.qf_info_white_num').html(10-(qfObj.state.whWallNum+qfObj.state.wvWallNum));
			} else if((qfObj.state.lastmove.wb === 0) && (qfObj.record.moves[qfObj.record.currentNum-1].hv === 1)){
				wallWBHV = t.find('.qf_wwall.qf_vwall');
				qfObj.state.wvWallNum -= 1;
				qfObj.state.vSpaces[qfObj.record.moves[qfObj.record.currentNum-1].place] = false;
				t.find('.qf_info_white_num').html(10-(qfObj.state.whWallNum+qfObj.state.wvWallNum));
			} else if((qfObj.state.lastmove.wb === 1) && (qfObj.record.moves[qfObj.record.currentNum-1].hv === 0)){
				wallWBHV = t.find('.qf_bwall.qf_hwall');
				qfObj.state.bhWallNum -= 1;
				qfObj.state.hSpaces[qfObj.record.moves[qfObj.record.currentNum-1].place] = false;
				t.find('.qf_info_black_num').html(10-(qfObj.state.bhWallNum+qfObj.state.bvWallNum));
			} else if((qfObj.state.lastmove.wb === 1) && (qfObj.record.moves[qfObj.record.currentNum-1].hv === 1)){
				wallWBHV = t.find('.qf_bwall.qf_vwall');
				qfObj.state.bvWallNum -= 1;
				qfObj.state.vSpaces[qfObj.record.moves[qfObj.record.currentNum-1].place] = false;
				t.find('.qf_info_black_num').html(10-(qfObj.state.bhWallNum+qfObj.state.bvWallNum));
			}
			wallWBHV.eq(qfObj.record.moves[qfObj.record.currentNum-1].place).css({
				'opacity': '0',
				'-webkit-transform': 'scale(3)',
				'-moz-transform': 'scale(3)',
				'-ms-transform': 'scale(3)',
				'-o-transform': 'scale(3)',
				'transform': 'scale(3)'
			});
		}

		if(qfObj.record.currentNum === 1){
			//cannot back anymore
			t.find('.qf_b_back_c').css('display', 'block');

			if(qfObj.fState.lastmove.wb === null){
				qfObj.state.lastmove.wb = null;
				qfObj.state.lastmove.pw = null;
				qfObj.state.lastmove.place = null;
				qfObj.hasState = false;
			} else {
				qfObj.state.lastmove.wb = qfObj.fState.lastmove.wb;
				qfObj.state.lastmove.pw = qfObj.fState.lastmove.pw;
				qfObj.state.lastmove.place = qfObj.fState.lastmove.place;
				if(qfObj.highlight === true){
					targetLM = seekHLTarget(el, qfObj);
					highlightOn(targetLM, bs);
				}
			}
		} else {
			//can back more
			qfObj.state.lastmove.wb = qfObj.record.moves[qfObj.record.currentNum-2].wb;
			qfObj.state.lastmove.pw = qfObj.record.moves[qfObj.record.currentNum-2].pw;
			qfObj.state.lastmove.place = qfObj.record.moves[qfObj.record.currentNum-2].place;

			if(qfObj.highlight === true){
				targetLM = seekHLTarget(el, qfObj);
				highlightOn(targetLM, bs);
			}
		}

		qfObj.state.turnNum -= 1;
		t.find('.qf_info_turn_num').html(qfObj.state.turnNum);

		qfObj.record.currentNum -= 1;

		t.find('.qf_b_next_c').css('display', 'none');
		adjustGBEvents(el, bs, qfObj);
	}

	function toNTbyNEXT(el, bs, qfObj){
		var t = $(el);

		var tMargin = parseInt(bs/3, 10);
		var wallWBHV;
		var pieceWB;
		var targetLM;

		if((qfObj.state.lastmove.pw !== null) && (qfObj.highlight === true)){
			targetLM = seekHLTarget(el, qfObj);
			highlightOff(targetLM, bs);
		}

		if(qfObj.record.moves[qfObj.record.currentNum].pw === 0){
			//piece
			if(qfObj.record.moves[qfObj.record.currentNum].wb === 0){
				pieceWB = t.find('.qf_piece_white');
				qfObj.state.wPiece = qfObj.record.moves[qfObj.record.currentNum].place;
			} else {
				pieceWB = t.find('.qf_piece_black');
				qfObj.state.bPiece = qfObj.record.moves[qfObj.record.currentNum].place;
			}
			pieceWB.css({
				top: 5*bs*(8-parseInt(qfObj.record.moves[qfObj.record.currentNum].place/9, 10)) + tMargin +'px',
				left: 5*bs*(qfObj.record.moves[qfObj.record.currentNum].place%9) + tMargin +'px'
			});
		} else {
			//wall
			if((qfObj.record.moves[qfObj.record.currentNum].wb === 0) && (qfObj.record.moves[qfObj.record.currentNum].hv === 0)){
				wallWBHV = t.find('.qf_wwall.qf_hwall');
				qfObj.state.whWallNum += 1;
				qfObj.state.hSpaces[qfObj.record.moves[qfObj.record.currentNum].place] = true;
				t.find('.qf_info_white_num').html(10-(qfObj.state.whWallNum+qfObj.state.wvWallNum));
			} else if((qfObj.record.moves[qfObj.record.currentNum].wb === 0) && (qfObj.record.moves[qfObj.record.currentNum].hv === 1)){
				wallWBHV = t.find('.qf_wwall.qf_vwall');
				qfObj.state.wvWallNum += 1;
				qfObj.state.vSpaces[qfObj.record.moves[qfObj.record.currentNum].place] = true;
				t.find('.qf_info_white_num').html(10-(qfObj.state.whWallNum+qfObj.state.wvWallNum));
			} else if((qfObj.record.moves[qfObj.record.currentNum].wb === 1) && (qfObj.record.moves[qfObj.record.currentNum].hv === 0)){
				wallWBHV = t.find('.qf_bwall.qf_hwall');
				qfObj.state.bhWallNum += 1;
				qfObj.state.hSpaces[qfObj.record.moves[qfObj.record.currentNum].place] = true;
				t.find('.qf_info_black_num').html(10-(qfObj.state.bhWallNum+qfObj.state.bvWallNum));
			} else if((qfObj.record.moves[qfObj.record.currentNum].wb === 1) && (qfObj.record.moves[qfObj.record.currentNum].hv === 1)){
				wallWBHV = t.find('.qf_bwall.qf_vwall');
				qfObj.state.bvWallNum += 1;
				qfObj.state.vSpaces[qfObj.record.moves[qfObj.record.currentNum].place] = true;
				t.find('.qf_info_black_num').html(10-(qfObj.state.bhWallNum+qfObj.state.bvWallNum));
			}
			wallWBHV.eq(qfObj.record.moves[qfObj.record.currentNum].place).css({
				'opacity': '1',
				'-webkit-transform': 'scale(1)',
				'-moz-transform': 'scale(1)',
				'-ms-transform': 'scale(1)',
				'-o-transform': 'scale(1)',
				'transform': 'scale(1)'
			});
		}

		if(qfObj.record.currentNum+1 === qfObj.record.moveNum){
			//cannot next anymore
			t.find('.qf_b_next_c').css('display', 'block');
		}

		qfObj.state.lastmove.wb = qfObj.record.moves[qfObj.record.currentNum].wb;
		qfObj.state.lastmove.pw = qfObj.record.moves[qfObj.record.currentNum].pw;
		qfObj.state.lastmove.place = qfObj.record.moves[qfObj.record.currentNum].place;

		if(qfObj.highlight === true){
			targetLM = seekHLTarget(el, qfObj);
			highlightOn(targetLM, bs);
		}

		qfObj.state.turnNum += 1;
		t.find('.qf_info_turn_num').html(qfObj.state.turnNum);

		qfObj.record.currentNum += 1;

		if(qfObj.recMode === false){
			t.find('.qf_b_back_c').css('display', 'none');
		}
		adjustGBEvents(el, bs, qfObj);
	}

	function calMovableNums(qfObj, movableNums){
		var numslen = 0;
		var myPlace, myPlaceX, myPlaceY, oppoPlace;

		if((qfObj.state.lastmove.wb === null) || (qfObj.state.lastmove.wb === 1)){
			myPlace = qfObj.state.wPiece;
			oppoPlace = qfObj.state.bPiece;
		} else {
			myPlace = qfObj.state.bPiece;
			oppoPlace = qfObj.state.wPiece;
		}

		myPlaceX = myPlace%9;
		myPlaceY = parseInt(myPlace/9, 10);

		//up
		if(myPlaceY !== 8){
			//no the upper end
			if(myPlaceX === 8){
				//the right end
				if(qfObj.state.hSpaces[8*myPlaceY+myPlaceX-1] === false){
					//no wall
					if(9*(myPlaceY+1)+myPlaceX === oppoPlace){
						//piece exist
						if((myPlaceY === 7) || (qfObj.state.hSpaces[8*(myPlaceY+1)+myPlaceX-1] === true)){
							//back of oppoPlace is the upper end or wall
							if(qfObj.state.vSpaces[8*myPlaceY+myPlaceX-1] === false){
								//movable!
								movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX-1;
								numslen += 1;
							}
						} else {
							//back of oppoPlace is free space
							//movable!
							movableNums[numslen] = 9*(myPlaceY+2)+myPlaceX;
							numslen += 1;
						}
					} else {
						//no piece
						//movable!
						movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX;
						numslen += 1;
					}
				}
			} else if(myPlaceX === 0) {
				//the left end
				if(qfObj.state.hSpaces[8*myPlaceY+myPlaceX] === false){
					//no wall
					if(9*(myPlaceY+1)+myPlaceX === oppoPlace){
						//piece exist
						if((myPlaceY === 7) || (qfObj.state.hSpaces[8*(myPlaceY+1)+myPlaceX] === true)){
							//back of oppoPlace is the upper end or wall
							if(qfObj.state.vSpaces[8*myPlaceY+myPlaceX] === false){
								//movable!
								movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX+1;
								numslen += 1;
							}
						} else {
							//back of oppoPlace is free space
							//movable!
							movableNums[numslen] = 9*(myPlaceY+2)+myPlaceX;
							numslen += 1;
						}
					} else {
						//no piece
						//movable!
						movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX;
						numslen += 1;
					}
				}
			} else {
				//not the right and left end
				if((qfObj.state.hSpaces[8*myPlaceY+myPlaceX-1] === false) && (qfObj.state.hSpaces[8*myPlaceY+myPlaceX] === false)){
					//no wall
					if(9*(myPlaceY+1)+myPlaceX === oppoPlace){
						//piece exist
						if(myPlaceY === 7){
							//back of oppoPlace is the upper end
							if(qfObj.state.vSpaces[8*myPlaceY+myPlaceX-1] === true){
								//cannot move left
								if(qfObj.state.vSpaces[8*myPlaceY+myPlaceX] === false){
									//can move right!
									movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX+1;
									numslen += 1;
								}
							} else if(qfObj.state.vSpaces[8*myPlaceY+myPlaceX] === true){
								//cannot move right
								if(qfObj.state.vSpaces[8*myPlaceY+myPlaceX-1] === false){
									//can move left!
									movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX-1;
									numslen += 1;
								}
							} else {
								//can move right and left!
								movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX+1;
								numslen += 1;
								movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX-1;
								numslen += 1;
							}
						} else if((qfObj.state.hSpaces[8*(myPlaceY+1)+myPlaceX-1] === true) || (qfObj.state.hSpaces[8*(myPlaceY+1)+myPlaceX] === true)){
							//back of oppoPlace is  wall
							if((qfObj.state.vSpaces[8*myPlaceY+myPlaceX-1] === true) || (qfObj.state.vSpaces[8*(myPlaceY+1)+myPlaceX-1] === true)){
								//cannot move left
								if((qfObj.state.vSpaces[8*myPlaceY+myPlaceX] === false) && (qfObj.state.vSpaces[8*(myPlaceY+1)+myPlaceX] === false)){
									//can move right!
									movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX+1;
									numslen += 1;
								}
							} else if((qfObj.state.vSpaces[8*myPlaceY+myPlaceX] === true) || (qfObj.state.vSpaces[8*(myPlaceY+1)+myPlaceX] === true)){
								//cannot move right
								if((qfObj.state.vSpaces[8*myPlaceY+myPlaceX-1] === false) && (qfObj.state.vSpaces[8*(myPlaceY+1)+myPlaceX-1] === false)){
									//can move left!
									movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX-1;
									numslen += 1;
								}
							} else {
								//can move right and left!
								movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX+1;
								numslen += 1;
								movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX-1;
								numslen += 1;
							}
						} else {
							//back of oppoPlace is free space
							//movable!
							movableNums[numslen] = 9*(myPlaceY+2)+myPlaceX;
							numslen += 1;
						}
					} else {
						//no piece
						//movable!
						movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX;
						numslen += 1;
					}
				}
			}
		}

		//right
		if(myPlaceX !== 8){
			//no the right end
			if(myPlaceY === 8){
				//the upper end
				if(qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX] === false){
					//no wall
					if(9*myPlaceY+myPlaceX+1 === oppoPlace){
						//piece exist
						if((myPlaceX === 7) || (qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX+1] === true)){
							//back of oppoPlace is the right end or wall
							if(qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX] === false){
								//movable!
								movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX+1;
								numslen += 1;
							}
						} else {
							//back of oppoPlace is free space
							//movable!
							movableNums[numslen] = 9*myPlaceY+myPlaceX+2;
							numslen += 1;
						}
					} else {
						//no piece
						//movable!
						movableNums[numslen] = 9*myPlaceY+myPlaceX+1;
						numslen += 1;
					}
				}
			} else if(myPlaceY === 0) {
				//the lower end
				if(qfObj.state.vSpaces[8*myPlaceY+myPlaceX] === false){
					//no wall
					if(9*myPlaceY+myPlaceX+1 === oppoPlace){
						//piece exist
						if((myPlaceX === 7) || (qfObj.state.vSpaces[8*myPlaceY+myPlaceX+1] === true)){
							//back of oppoPlace is the right end or wall
							if(qfObj.state.hSpaces[8*myPlaceY+myPlaceX] === false){
								//movable!
								movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX+1;
								numslen += 1;
							}
						} else {
							//back of oppoPlace is free space
							//movable!
							movableNums[numslen] = 9*myPlaceY+myPlaceX+2;
							numslen += 1;
						}
					} else {
						//no piece
						//movable!
						movableNums[numslen] = 9*myPlaceY+myPlaceX+1;
						numslen += 1;
					}
				}
			} else {
				//not the upper and lower end
				if((qfObj.state.vSpaces[8*myPlaceY+myPlaceX] === false) && (qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX] === false)){
					//no wall
					if(9*myPlaceY+myPlaceX+1 === oppoPlace){
						//piece exist
						if(myPlaceX === 7){
							//back of oppoPlace is the right end
							if(qfObj.state.hSpaces[8*myPlaceY+myPlaceX] === true){
								//cannot move up
								if(qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX] === false){
									//can move down!
									movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX+1;
									numslen += 1;
								}
							} else if(qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX] === true){
								//cannot move down
								if(qfObj.state.hSpaces[8*myPlaceY+myPlaceX] === false){
									//can move up!
									movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX+1;
									numslen += 1;
								}
							} else {
								//can move down and up!
								movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX+1;
								numslen += 1;
								movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX+1;
								numslen += 1;
							}
						} else if((qfObj.state.vSpaces[8*myPlaceY+myPlaceX+1] === true) || (qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX+1] === true)){
							//back of oppoPlace is  wall
							if((qfObj.state.hSpaces[8*myPlaceY+myPlaceX] === true) || (qfObj.state.hSpaces[8*myPlaceY+myPlaceX+1] === true)){
								//cannot move up
								if((qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX] === false) && (qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX+1] === false)){
									//can move down!
									movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX+1;
									numslen += 1;
								}
							} else if((qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX] === true) || (qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX+1] === true)){
								//cannot move down
								if((qfObj.state.hSpaces[8*myPlaceY+myPlaceX] === false) && (qfObj.state.hSpaces[8*myPlaceY+myPlaceX+1] === false)){
									//can move up!
									movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX+1;
									numslen += 1;
								}
							} else {
								//can move down and up!
								movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX+1;
								numslen += 1;
								movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX+1;
								numslen += 1;
							}
						} else {
							//back of oppoPlace is free space
							//movable!
							movableNums[numslen] = 9*myPlaceY+myPlaceX+2;
							numslen += 1;
						}
					} else {
						//no piece
						//movable!
						movableNums[numslen] = 9*myPlaceY+myPlaceX+1;
						numslen += 1;
					}
				}
			}
		}

		//down
		if(myPlaceY !== 0){
			//no the lower end
			if(myPlaceX === 8){
				//the right end
				if(qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX-1] === false){
					//no wall
					if(9*(myPlaceY-1)+myPlaceX === oppoPlace){
						//piece exist
						if((myPlaceY === 1) || (qfObj.state.hSpaces[8*(myPlaceY-2)+myPlaceX-1] === true)){
							//back of oppoPlace is the lower end or wall
							if(qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX-1] === false){
								//movable!
								movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX-1;
								numslen += 1;
							}
						} else {
							//back of oppoPlace is free space
							//movable!
							movableNums[numslen] = 9*(myPlaceY-2)+myPlaceX;
							numslen += 1;
						}
					} else {
						//no piece
						//movable!
						movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX;
						numslen += 1;
					}
				}
			} else if(myPlaceX === 0) {
				//the left end
				if(qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX] === false){
					//no wall
					if(9*(myPlaceY-1)+myPlaceX === oppoPlace){
						//piece exist
						if((myPlaceY === 1) || (qfObj.state.hSpaces[8*(myPlaceY-2)+myPlaceX] === true)){
							//back of oppoPlace is the lower end or wall
							if(qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX] === false){
								//movable!
								movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX+1;
								numslen += 1;
							}
						} else {
							//back of oppoPlace is free space
							//movable!
							movableNums[numslen] = 9*(myPlaceY-2)+myPlaceX;
							numslen += 1;
						}
					} else {
						//no piece
						//movable!
						movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX;
						numslen += 1;
					}
				}
			} else {
				//not the right and left end
				if((qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX-1] === false) && (qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX] === false)){
					//no wall
					if(9*(myPlaceY-1)+myPlaceX === oppoPlace){
						//piece exist
						if(myPlaceY === 1){
							//back of oppoPlace is the lower end
							if(qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX-1] === true){
								//cannot move left
								if(qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX] === false){
									//can move right!
									movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX+1;
									numslen += 1;
								}
							} else if(qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX] === true){
								//cannot move right
								if(qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX-1] === false){
									//can move left!
									movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX-1;
									numslen += 1;
								}
							} else {
								//can move right and left!
								movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX+1;
								numslen += 1;
								movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX-1;
								numslen += 1;
							}
						} else if((qfObj.state.hSpaces[8*(myPlaceY-2)+myPlaceX-1] === true) || (qfObj.state.hSpaces[8*(myPlaceY-2)+myPlaceX] === true)){
							//back of oppoPlace is  wall
							if((qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX-1] === true) || (qfObj.state.vSpaces[8*(myPlaceY-2)+myPlaceX-1] === true)){
								//cannot move left
								if((qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX] === false) && (qfObj.state.vSpaces[8*(myPlaceY-2)+myPlaceX] === false)){
									//can move right!
									movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX+1;
									numslen += 1;
								}
							} else if((qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX] === true) || (qfObj.state.vSpaces[8*(myPlaceY-2)+myPlaceX] === true)){
								//cannot move right
								if((qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX-1] === false) && (qfObj.state.vSpaces[8*(myPlaceY-2)+myPlaceX-1] === false)){
									//can move left!
									movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX-1;
									numslen += 1;
								}
							} else {
								//can move right and left!
								movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX+1;
								numslen += 1;
								movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX-1;
								numslen += 1;
							}
						} else {
							//back of oppoPlace is free space
							//movable!
							movableNums[numslen] = 9*(myPlaceY-2)+myPlaceX;
							numslen += 1;
						}
					} else {
						//no piece
						//movable!
						movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX;
						numslen += 1;
					}
				}
			}
		}

		//left
		if(myPlaceX !== 0){
			//no the left end
			if(myPlaceY === 8){
				//the upper end
				if(qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX-1] === false){
					//no wall
					if(9*myPlaceY+myPlaceX-1 === oppoPlace){
						//piece exist
						if((myPlaceX === 1) || (qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX-2] === true)){
							//back of oppoPlace is the left end or wall
							if(qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX-1] === false){
								//movable!
								movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX-1;
								numslen += 1;
							}
						} else {
							//back of oppoPlace is free space
							//movable!
							movableNums[numslen] = 9*myPlaceY+myPlaceX-2;
							numslen += 1;
						}
					} else {
						//no piece
						//movable!
						movableNums[numslen] = 9*myPlaceY+myPlaceX-1;
						numslen += 1;
					}
				}
			} else if(myPlaceY === 0) {
				//the lower end
				if(qfObj.state.vSpaces[8*myPlaceY+myPlaceX-1] === false){
					//no wall
					if(9*myPlaceY+myPlaceX-1 === oppoPlace){
						//piece exist
						if((myPlaceX === 1) || (qfObj.state.vSpaces[8*myPlaceY+myPlaceX-2] === true)){
							//back of oppoPlace is the left end or wall
							if(qfObj.state.hSpaces[8*myPlaceY+myPlaceX-1] === false){
								//movable!
								movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX-1;
								numslen += 1;
							}
						} else {
							//back of oppoPlace is free space
							//movable!
							movableNums[numslen] = 9*myPlaceY+myPlaceX-2;
							numslen += 1;
						}
					} else {
						//no piece
						//movable!
						movableNums[numslen] = 9*myPlaceY+myPlaceX-1;
						numslen += 1;
					}
				}
			} else {
				//not the upper and lower end
				if((qfObj.state.vSpaces[8*myPlaceY+myPlaceX-1] === false) && (qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX-1] === false)){
					//no wall
					if(9*myPlaceY+myPlaceX-1 === oppoPlace){
						//piece exist
						if(myPlaceX === 1){
							//back of oppoPlace is the left end
							if(qfObj.state.hSpaces[8*myPlaceY+myPlaceX-1] === true){
								//cannot move up
								if(qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX-1] === false){
									//can move down!
									movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX-1;
									numslen += 1;
								}
							} else if(qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX-1] === true){
								//cannot move down
								if(qfObj.state.hSpaces[8*myPlaceY+myPlaceX-1] === false){
									//can move up!
									movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX-1;
									numslen += 1;
								}
							} else {
								//can move down and up!
								movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX-1;
								numslen += 1;
								movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX-1;
								numslen += 1;
							}
						} else if((qfObj.state.vSpaces[8*myPlaceY+myPlaceX-2] === true) || (qfObj.state.vSpaces[8*(myPlaceY-1)+myPlaceX-2] === true)){
							//back of oppoPlace is  wall
							if((qfObj.state.hSpaces[8*myPlaceY+myPlaceX-2] === true) || (qfObj.state.hSpaces[8*myPlaceY+myPlaceX-1] === true)){
								//cannot move up
								if((qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX-2] === false) && (qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX-1] === false)){
									//can move down!
									movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX-1;
									numslen += 1;
								}
							} else if((qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX-2] === true) || (qfObj.state.hSpaces[8*(myPlaceY-1)+myPlaceX-1] === true)){
								//cannot move down
								if((qfObj.state.hSpaces[8*myPlaceY+myPlaceX-2] === false) && (qfObj.state.hSpaces[8*myPlaceY+myPlaceX-1] === false)){
									//can move up!
									movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX-1;
									numslen += 1;
								}
							} else {
								//can move down and up!
								movableNums[numslen] = 9*(myPlaceY-1)+myPlaceX-1;
								numslen += 1;
								movableNums[numslen] = 9*(myPlaceY+1)+myPlaceX-1;
								numslen += 1;
							}
						} else {
							//back of oppoPlace is free space
							//movable!
							movableNums[numslen] = 9*myPlaceY+myPlaceX-2;
							numslen += 1;
						}
					} else {
						//no piece
						//movable!
						movableNums[numslen] = 9*myPlaceY+myPlaceX-1;
						numslen += 1;
					}
				}
			}
		}
	}

	function highlightOn(obj, bs){
		var tMargin = parseInt(bs/3, 10);
		var length = parseInt(bs/6, 10);
		if(length === 0){
			length = 1;
		}

		if(obj.hasClass('qf_piece')) {
			obj.css({
				width: 4*bs-2*tMargin-2*length,
				height: 4*bs-2*tMargin-2*length
			});
		} else if(obj.hasClass('qf_hwall')){
			obj.css({
				width: 9*bs-2*length,
				height: bs-2*length
			});
		} else if(obj.hasClass('qf_vwall')){
			obj.css({
				width: bs-2*length,
				height: 9*bs-2*length
			});
		}

		obj.css({
			borderStyle: 'solid',
			borderWidth: length
		}).addClass('qf_highlighted');
	}

	function highlightOff(obj, bs){
		var tMargin = parseInt(bs/3, 10);

		if(obj.hasClass('qf_piece')) {
			obj.css({
				width: 4*bs-2*tMargin,
				height: 4*bs-2*tMargin
			});
		} else if(obj.hasClass('qf_hwall')){
			obj.css({
				width: 9*bs,
				height: bs
			});
		} else if(obj.hasClass('qf_vwall')){
			obj.css({
				width: bs,
				height: 9*bs
			});
		}

		obj.css({
			borderStyle: 'none',
		}).removeClass('qf_highlighted');
	}

	function seekHLTarget(el, qfObj){
		var t = $(el);
		if(qfObj.state.lastmove.pw === 0){
			//piece
			if(qfObj.state.lastmove.wb === 0){
				return t.find('.qf_piece_white');
			} else {
				return t.find('.qf_piece_black');
			}
		} else {
			//wall
			if(qfObj.state.hSpaces[qfObj.state.lastmove.place] === true){
				if(qfObj.state.lastmove.wb === 0){
					return t.find('.qf_wwall.qf_hwall').eq(qfObj.state.lastmove.place);
				} else {
					return t.find('.qf_bwall.qf_hwall').eq(qfObj.state.lastmove.place);
				}
			} else {
				if(qfObj.state.lastmove.wb === 0){
					return t.find('.qf_wwall.qf_vwall').eq(qfObj.state.lastmove.place);
				} else {
					return t.find('.qf_bwall.qf_vwall').eq(qfObj.state.lastmove.place);
				}
			}
		}
	}

	function initqfObj(qfObj){
		qfObj.fState = {};
		qfObj.fState.lastmove = {};
		qfObj.rState = {};
		qfObj.rState.lastmove = {};
		qfObj.state = {};
		qfObj.state.hSpaces = [];
		qfObj.state.vSpaces = [];
		qfObj.state.lastmove = {};
		qfObj.record = {};

		qfObj.inv = false;
		qfObj.gray = false;
		qfObj.highlight = false;
		qfObj.recMode = false;

		resetqfObj(qfObj);
	}

	function resetqfObj(qfObj){
		var i;

		qfObj.hasState = false;
		qfObj.hasRecord = false;
		qfObj.recMode = false;

		qfObj.fState.whWalls = [];
		qfObj.fState.wvWalls = [];
		qfObj.fState.bhWalls = [];
		qfObj.fState.bvWalls = [];
		qfObj.fState.lastmove.wb = null;
		qfObj.fState.lastmove.pw = null;
		qfObj.fState.lastmove.place = null;

		qfObj.rState.hasState = false;
		qfObj.rState.wPiece = null;
		qfObj.rState.bPiece = null;
		qfObj.rState.whWalls = [];
		qfObj.rState.wvWalls = [];
		qfObj.rState.bhWalls = [];
		qfObj.rState.bvWalls = [];
		qfObj.rState.whWallNum = null;
		qfObj.rState.wvWallNum = null;
		qfObj.rState.bhWallNum = null;
		qfObj.rState.bvWallNum = null;
		qfObj.rState.lastmove.wb = null;
		qfObj.rState.lastmove.pw = null;
		qfObj.rState.lastmove.place = null;
		qfObj.rState.turnNum = null;

		qfObj.state.wPiece = 4;
		qfObj.state.bPiece = 76;
		qfObj.state.whWallNum = 0;
		qfObj.state.wvWallNum = 0;
		qfObj.state.bhWallNum = 0;
		qfObj.state.bvWallNum = 0;
		for(i=0; i<64; i++){
			qfObj.state.hSpaces[i] = false;
			qfObj.state.vSpaces[i] = false;
		}
		qfObj.state.lastmove.wb = null;
		qfObj.state.lastmove.pw = null;
		qfObj.state.lastmove.place = null;

		qfObj.state.turnNum = 1;

		qfObj.record.moveNum = 0;
		qfObj.record.moves = [];
		qfObj.record.currentNum = 0;
		qfObj.record.recStartNum = null;
	}

	function base64Encode(el, qfObj){
		var t = $(el);
		var qfCode;
		var i, len, num, num2, num3, num4, twhWalls, twvWalls, tbhWalls, tbvWalls, twhWallNum, twvWallNum, tbhWallNum, tbvWallNum;
		var bin = [];

		if(qfObj.recMode){
			//rec
			if(qfObj.rState.hasState){
				//have state
				//flags
				numToBin(bin, 1, 1);
				numToBin(bin, 1, 1);
				//state
				num = qfObj.rState.wPiece;
				numToBin(bin, num, 7);
				num = qfObj.rState.bPiece;
				numToBin(bin, num, 7);

				num = qfObj.rState.whWallNum;
				numToBin(bin, num, 4);
				for(i=0; i<qfObj.rState.whWallNum; i++){
					num = qfObj.rState.whWalls[i];
					numToBin(bin, num, 6);
				}

				num = qfObj.rState.wvWallNum;
				numToBin(bin, num, 4);
				for(i=0; i<qfObj.rState.wvWallNum; i++){
					num = qfObj.rState.wvWalls[i];
					numToBin(bin, num, 6);
				}

				num = qfObj.rState.bhWallNum;
				numToBin(bin, num, 4);
				for(i=0; i<qfObj.rState.bhWallNum; i++){
					num = qfObj.rState.bhWalls[i];
					numToBin(bin, num, 6);
				}

				num = qfObj.rState.bvWallNum;
				numToBin(bin, num, 4);
				for(i=0; i<qfObj.rState.bvWallNum; i++){
					num = qfObj.rState.bvWalls[i];
					numToBin(bin, num, 6);
				}

				num = qfObj.rState.lastmove.wb;
				numToBin(bin, num, 1);
				num = qfObj.rState.lastmove.pw;
				numToBin(bin, num, 1);
				if(qfObj.rState.lastmove.pw === 1){
					num = qfObj.rState.lastmove.place;
					numToBin(bin, num, 6);
				}

				num = qfObj.rState.turnNum;
				numToBin(bin, num, 10);
			} else {
				//no state
				numToBin(bin, 0, 1);
				numToBin(bin, 1, 1);
			}

			//record
			num = qfObj.record.currentNum - qfObj.record.recStartNum;
			numToBin(bin, num, 10);

			for(i=0; i<num; i++){
				num2 = qfObj.record.moves[i + qfObj.record.recStartNum].pw;
				if(num2 === 0){
					//piece
					numToBin(bin, 0, 1);
					num3 = qfObj.record.moves[i + qfObj.record.recStartNum].place - qfObj.record.moves[i + qfObj.record.recStartNum].backPlace;
					switch(num3){
						case 9:
						case 18:
							num4 = 0;
							break;
						case 10:
							num4 = 1;
							break;
						case 1:
						case 2:
							num4 = 2;
							break;
						case -8:
							num4 = 3;
							break;
						case -9:
						case -18:
							num4 = 4;
							break;
						case -10:
							num4 = 5;
							break;
						case -1:
						case -2:
							num4 = 6;
							break;
						case 8:
							num4 = 7;
							break;
					}
					numToBin(bin, num4, 3);
				} else {
					//wall
					numToBin(bin, 1, 1);
					num3 = qfObj.record.moves[i + qfObj.record.recStartNum].hv;
					numToBin(bin, num3, 1);
					num3 = qfObj.record.moves[i + qfObj.record.recStartNum].place;
					numToBin(bin, num3, 6);
				}
			}
		} else {
			//snap
			//flags
			numToBin(bin, 1, 1);
			numToBin(bin, 0, 1);
			//state
			num = qfObj.state.wPiece;
			numToBin(bin, num, 7);
			num = qfObj.state.bPiece;
			numToBin(bin, num, 7);

			twhWalls = [];
			twvWalls = [];
			tbhWalls = [];
			tbvWalls = [];
			twhWallNum = 0;
			twvWallNum = 0;
			tbhWallNum = 0;
			tbvWallNum = 0;
			for(i=0; i<64; i++){
				if(qfObj.state.hSpaces[i]){
					if(t.find('.qf_hwall.qf_wwall').eq(i).css('opacity') === '1'){
						twhWalls[twhWallNum] = i;
						twhWallNum += 1;
					} else {
						tbhWalls[tbhWallNum] = i;
						tbhWallNum += 1;
					}
				}
				if(qfObj.state.vSpaces[i]){
					if(t.find('.qf_vwall.qf_wwall').eq(i).css('opacity') === '1'){
						twvWalls[twvWallNum] = i;
						twvWallNum += 1;
					} else {
						tbvWalls[tbvWallNum] = i;
						tbvWallNum += 1;
					}
				}
			}

			num = twhWallNum;
			numToBin(bin, num, 4);
			for(i=0; i<twhWallNum; i++){
				num = twhWalls[i];
				numToBin(bin, num, 6);
			}

			num = twvWallNum;
			numToBin(bin, num, 4);
			for(i=0; i<twvWallNum; i++){
				num = twvWalls[i];
				numToBin(bin, num, 6);
			}

			num = tbhWallNum;
			numToBin(bin, num, 4);
			for(i=0; i<tbhWallNum; i++){
				num = tbhWalls[i];
				numToBin(bin, num, 6);
			}

			num = tbvWallNum;
			numToBin(bin, num, 4);
			for(i=0; i<tbvWallNum; i++){
				num = tbvWalls[i];
				numToBin(bin, num, 6);
			}

			num = qfObj.state.lastmove.wb;
			numToBin(bin, num, 1);
			num = qfObj.state.lastmove.pw;
			numToBin(bin, num, 1);
			if(qfObj.state.lastmove.pw === 1){
				num = qfObj.state.lastmove.place;
				numToBin(bin, num, 6);
			}

			num = qfObj.state.turnNum;
			numToBin(bin, num, 10);
		}

		//bin to string
		num = bin.length%6;
		num2 = bin.length;
		if(num > 0 ){
			for(i=0; i<(6-num); i++){
				bin[num2+i] = 0;
			}
		}

		qfCode = '';
		len = parseInt(bin.length/6, 10);
		for(i=0; i<len; i++){
			num = binToNum(bin, 6*i, 6);
			qfCode += b64chars.charAt(num);
		}

		return qfCode;
	}

	function base64Decode(qfObj, qfCode){
		var tStr = String(qfCode);
		var i, len, num, p, wP, bP, startTurn, dMove;
		var bin = [];

		len = tStr.length;
		for(i=0; i<len; i++){
			num = b64idxs[tStr.charAt(i)];
			if(num == null) continue;

			bin[6*i] = (num >>> 5) & 1;
			bin[6*i+1] = (num >>> 4) & 1;
			bin[6*i+2] = (num >>> 3) & 1;
			bin[6*i+3] = (num >>> 2) & 1;
			bin[6*i+4] = (num >>> 1) & 1;
			bin[6*i+5] = num & 1;
		}

		resetqfObj(qfObj);

		p = 2;
		if(bin[0]){
			qfObj.hasState = true;

			qfObj.state.wPiece = binToNum(bin, p, 7);
			p += 7;
			qfObj.state.bPiece = binToNum(bin, p, 7);
			p += 7;


			qfObj.state.whWallNum = binToNum(bin, p, 4);
			p += 4;
			len = qfObj.state.whWallNum;
			for(i=0; i<len; i++){
				num = binToNum(bin, p, 6);
				p += 6;
				qfObj.fState.whWalls[i] = num;
				qfObj.state.hSpaces[num] = true;
			}

			qfObj.state.wvWallNum = binToNum(bin, p, 4);
			p += 4;
			len = qfObj.state.wvWallNum;
			for(i=0; i<len; i++){
				num = binToNum(bin, p, 6);
				p += 6;
				qfObj.fState.wvWalls[i] = num;
				qfObj.state.vSpaces[num] = true;
			}

			qfObj.state.bhWallNum = binToNum(bin, p, 4);
			p += 4;
			len = qfObj.state.bhWallNum;
			for(i=0; i<len; i++){
				num = binToNum(bin, p, 6);
				p += 6;
				qfObj.fState.bhWalls[i] = num;
				qfObj.state.hSpaces[num] = true;
			}

			qfObj.state.bvWallNum = binToNum(bin, p, 4);
			p += 4;
			len = qfObj.state.bvWallNum;
			for(i=0; i<len; i++){
				num = binToNum(bin, p, 6);
				p += 6;
				qfObj.fState.bvWalls[i] = num;
				qfObj.state.vSpaces[num] = true;
			}

			qfObj.fState.lastmove.wb = qfObj.state.lastmove.wb = bin[p];
			p += 1;
			qfObj.fState.lastmove.pw = qfObj.state.lastmove.pw = bin[p];
			p += 1;
			if(qfObj.state.lastmove.pw === 1){
				qfObj.fState.lastmove.place = qfObj.state.lastmove.place = binToNum(bin, p, 6);
				p += 6;
			}

			qfObj.state.turnNum = binToNum(bin, p, 10);
			p += 10;

		}

		if(bin[1]){
			qfObj.hasRecord = true;

			qfObj.record.moveNum = binToNum(bin, p, 10);
			p += 10;

			len = qfObj.record.moveNum;
			wP = qfObj.state.wPiece;
			bP = qfObj.state.bPiece;
			if((qfObj.state.lastmove.wb === null) || (qfObj.state.lastmove.wb === 1)){
				startTurn = 0;
			} else {
				startTurn = 1;
			}
			for(i=0; i<len; i++){
				qfObj.record.moves[i] = {};

				if((startTurn + i)%2 === 0) {
					qfObj.record.moves[i].wb = 0; //white turn
				} else {
					qfObj.record.moves[i].wb = 1; //black turn
				}

				qfObj.record.moves[i].pw = bin[p];
				p += 1;

				if(qfObj.record.moves[i].pw === 0){
					//piece
					num = binToNum(bin, p, 3);
					p += 3;

					switch(num){
						case 0:
							dMove = 9;
							break;
						case 1:
							dMove = 10;
							break;
						case 2:
							dMove = 1;
							break;
						case 3:
							dMove = -8;
							break;
						case 4:
							dMove = -9;
							break;
						case 5:
							dMove = -10;
							break;
						case 6:
							dMove = -1;
							break;
						case 7:
							dMove = 8;
							break;
					}

					if(qfObj.record.moves[i].wb){
						//black turn
						qfObj.record.moves[i].backPlace = bP;
						bP += dMove;
						if(bP === wP){
							bP += dMove;
						}
						qfObj.record.moves[i].place = bP;
					} else {
						//white turn
						qfObj.record.moves[i].backPlace = wP;
						wP += dMove;
						if(wP === bP){
							wP += dMove;
						}
						qfObj.record.moves[i].place = wP;
					}
				} else {
					//wall
					qfObj.record.moves[i].hv = bin[p];
					p += 1;
					qfObj.record.moves[i].place = binToNum(bin, p, 6);
					p += 6;
				}
			}
		}
	}

	function binToNum(bin, start, length){
		var i;
		var num = 0;
		for(i=0; i<length; i++){
			num += (bin[start+i] << (length-i-1));
		}
		return num;
	}

	function numToBin(bin, num, nbit){
		var i;
		var len = bin.length;
		for(i=0; i<nbit; i++){
			bin[len+i] = (num >>> (nbit-i-1)) & 1;
		}
	}

	//execute part
	$('.qf_freeboard').each(createWholeBoard);
});
