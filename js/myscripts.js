$(document).ready(function () {

    var numbers = resetNumbers();
    var maxRowCount = 8; //max row count allowed
    
    var count = 1; //initial row count
    var countDiv = 1;

    //--------------Reset Numbers--------------
    function resetNumbers() {
	    numbers = [];
	    for(var i=0; i<4; i++){
		    numbers[i] = Math.floor(10*Math.random());
	    }

	    var i = repeatedNumbers(numbers);

	    while(i != -1){
		    numbers[i] = Math.floor(10*Math.random());
		    i = repeatedNumbers(numbers);
	    }

	    deleteRows();
	    createNewRow();

	    return numbers;
    }

    //check bull count
    function bulls(array){

	    var bullCount = 0;
	    for(var i=0; i<4; i++){
		    if(numbers[i] == array[i])
		        bullCount++;
	    }
	    return bullCount;
    }

    //check cow count
    function cows(array){
	    var cowCount=0;
	    for(var i=0; i<4; i++){
		    //not in the same position, but in other of the array
		    if(numbers[i] != array[i]){
			    var n = array[i];
			    for(var j=0; j<4; j++){
				    if(numbers[j] == n){
				        cowCount++;
				    }
			    }
		    }
	    }
	    return cowCount;
    }

    //Check if the array has bulls or cows if the numbers don't repeat
    function check(array){
	    var result=[-1,-1];
	
	    if (repeatedNumbers(array) != -1) {
	        //show modal
	        $("#numRepModal").modal('show');
	    }
	    else {
	        var bullCount = bulls(array);
	        var cowCount = 0;
	        if (bullCount != 4) {
	            cowCount = cows(array);
	        }
	        result = [bullCount, cowCount];
	    }
	    return result;
    }

    function repeatedNumbers(array){
	    var n = -1;
	    for(var i=0, j=0, r=false; i<4 && !r; i++){
		    while(j<4 && !r){
			    if(i!=j && array[i] == array[j]){
				    r = true;
				    n = i;
			    }
			    j++;
		    }
		    j=0;
	    }
	    return n;
    }

    //---------------------Ckeck button-----------------------------------------
    $("#checkbtn").click(function (e) {
        e.preventDefault();
        var n1 = $('#div' + countDiv + " :input[name=num1]").val();
        var n2 = $('#div' + countDiv + " :input[name=num2]").val();
        var n3 = $('#div' + countDiv + " :input[name=num3]").val();
        var n4 = $('#div' + countDiv + " :input[name=num4]").val();
        var array = [n1, n2, n3, n4];

        result = check(array);
        $('#div' + countDiv + " :input[name=bulls]").val(result[0]);
        $('#div' + countDiv + " :input[name=cows]").val(result[1]);

        if (result[0] == 4) {//4 bulls -> you win
            disableLastRow();
            $("#youWinModal").modal('show');
            $("#checkbtn").attr("disabled", "disabled");
        }
        else if (count == maxRowCount) {
            disableLastRow();
            $("#maxRowCountModal").modal('show');
        }
        else if (result[0] != -1 && result[1] != -1) {
            disableLastRow();
            createNewRow();
        }
    });

    //----------------Disable last row----------------
    function disableLastRow() {
        $('#div' + countDiv + " :input[name=num1]").attr("disabled", "disabled");
        $('#div' + countDiv + " :input[name=num2]").attr("disabled", "disabled");
        $('#div' + countDiv + " :input[name=num3]").attr("disabled", "disabled");
        $('#div' + countDiv + " :input[name=num4]").attr("disabled", "disabled");
    }

    //----------------Create New row----------------
    function createNewRow() {
        count++;
        countDiv++;

        //Create new inputs
        var num1 = $('<div class="col-1"><input type="text" class="form-control onlyNumbers" pattern="[0-9]{1}" maxlength="1" name="num1"></div>');
        var num2 = $('<div class="col-1"><input type="text" class="form-control onlyNumbers" pattern="[0-9]{1}" maxlength="1" name="num2"></div>');
        var num3 = $('<div class="col-1"><input type="text" class="form-control onlyNumbers" pattern="[0-9]{1}" maxlength="1" name="num3"></div>');
        var num4 = $('<div class="col-1"><input type="text" class="form-control onlyNumbers" pattern="[0-9]{1}" maxlength="1" name="num4"></div>');
        var bullsResult = $('<div class="col-2"><div class="row justify-content-center"><div class="col-6"><input type="text" name="bulls" class="form-control" disabled></input></div></div></div>')
        var cowsResult = $('<div class="col-2"><div class="row justify-content-center"><div class="col-6"><input type="text" name="cows" class="form-control" disabled></input></div></div></div>')
        
        //add rows to divNumbers
        $('#divNumbers').append('<div id="div' + countDiv + '" class="row justify-content-center"></div>');
        var $mydiv = $('#div' + countDiv);
        num1.appendTo($mydiv);
        num2.appendTo($mydiv);
        num3.appendTo($mydiv);
        num4.appendTo($mydiv);
        bullsResult.appendTo($mydiv);
        cowsResult.appendTo($mydiv);
    }

    //---------------Delete All Rows-----------------
    function deleteRows() {
        $('#divNumbers div').empty(); //Clears content of divs inside divNumbers leaving this one intact
        count = 0;
        countDiv = 0;
    }

    //--------------Modal Config MaxRow--------------
    $("#configBtn").click(function (e) {
        e.preventDefault();
        maxRowCount = $("#inputMaxRow").val();
        resetNumbers();
    });

    //--------------Call Reset Numbers Function--------------
    $("#resetbtn, #youLostBtn, #youWinBtn").click(function (e) {
        e.preventDefault();
        resetNumbers(); 
        $("#checkbtn").removeAttr("disabled");
    });

    //------------------------------------------------------------------------------
    //------------------------- INPUT EVENTS ---------------------------------------
    $('.noneKeyPress').keypress(function (key) {
        return false; 
    });

    // Restricts input for the given jQuery object to the given inputFilter.
    function setInputFilter(obj, inputFilter) {
        obj.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
    }

    // InputFilter to Restrict input to Digits Only by using a regular expression filter.
    setInputFilter($(".onlyNumbers"), function (value) {
        return /^\d*$/.test(value);
    });

});