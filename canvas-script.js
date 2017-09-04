(function(){

  function CropCanvasLib (){
    this.document = document;
    this.cropCanvas = this.document.querySelector('#crop-canvas');
    this.cropCanvasContext = this.cropCanvas.getContext('2d');
    this.filterCanvas = this.document.querySelector('#filter-canvas');
    this.imageEle = this.document.querySelector('img');
    this.inputEle = this.document.querySelector('input');
    this.imageObject = new Image();
    this.imageObjectSrc = "./images/flowers.jpg";
    this.deltaX;
    this.deltaY;
    this.filterApplied = false;
  };
  
  
  CropCanvasLib.prototype.createCropArea = function(){
    this.imageEle.classList.add('hide');
    var imageObject = new Image();
    imageObject.onload = ()=>{
      this.cropCanvasContext.drawImage(imageObject, 0, 0, imageObject.width, imageObject.height, 0, 0, 568, 320);
      var imageURI = this.cropCanvas.toDataURL("image/png");
      this.imageObject.src = imageURI;
      this.cropCanvas.classList.add('show');
    }
    imageObject.src = this.imageObjectSrc;
  
    if(this.cropDiv){
      this.cropDiv.remove();
    }
    if(this.filterCanvas.visible){
      this.filterCanvas.getContext('2d').clearRect();
    }
    this.showElement(this.cropCanvas);
    this.cropDiv = this.document.createElement('div');
    var canvasCont = this.document.querySelector(".canvas-cont");
    canvasCont.appendChild(this.cropDiv);
    this.cropDiv.classList.add('crop-select');
    this.cropDiv.setAttribute("draggable", "true");
    this.cropDiv.addEventListener('dragover', function(e){
      e.preventDefault();
    }, false);
    this.cropDiv.addEventListener('dragstart', this.cropAreaDragStartHandler.bind(this), false);
    this.cropCanvas.addEventListener('dragover', function(e){
      e.preventDefault();
    }, false);
    this.cropCanvas.addEventListener('drop', this.cropCanvasDropHandler.bind(this), false);
  }
  
  
  CropCanvasLib.prototype.cropAreaDragStartHandler = function(e){
    e.stopPropagation();
    this.deltaX = e.clientX - this.cropDiv.getBoundingClientRect().left;
    this.deltaY = e.clientY - this.cropDiv.getBoundingClientRect().top;
  }
  
  
  CropCanvasLib.prototype.cropCanvasDropHandler = function(e){
    e.preventDefault();
    if (e.stopPropagation) {
     e.stopPropagation(); // Stops some browsers from redirecting.
    }
    var position = this.cropDiv.getBoundingClientRect();
    var cropWidth = this.cropDiv.offsetWidth;
    var cropHeight = this.cropDiv.offsetHeight;
    var finalLeft = position.left
    var finalTop = position.top
    var left = e.pageX - this.deltaX;
    var top = e.pageY - this.deltaY;
    this.cropDiv.style.top = top + "px";
    this.cropDiv.style.left = left + "px";
   return false;
  }
  
  
  CropCanvasLib.prototype.cropAreaSelelcted = function(event){
    var imageObject = new Image();
    var cropWidth = this.cropDiv.offsetWidth;
    var cropHeight = this.cropDiv.offsetHeight;
    var placeholderDivCor = this.document.querySelector(".placeholder-div").getBoundingClientRect();
    var position = this.cropDiv.getBoundingClientRect();
    this.cropDiv.style.display = 'none';
    var cropLeftOffset =  left = position.left - placeholderDivCor.left; //e.clientX;
    var cropTopOffset = top = position.top - placeholderDivCor.top; //e.clientY;
  
    this.cropCanvas.classList.add('crop-canvas-background');
    this.filterCanvas.style.top = (cropTopOffset-1) + 'px';
    this.filterCanvas.style.left = (cropLeftOffset-1) + 'px';
    this.filterCanvas.height = cropHeight;
    this.filterCanvas.width = cropWidth;
    this.filterCanvas.style.display = 'block';
    var filterContext = this.filterCanvas.getContext('2d');
    imageObject.onload = function(){
      filterContext.drawImage(imageObject, cropLeftOffset, cropTopOffset, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    }
    imageObject.src = this.cropCanvas.toDataURL("image/png");
  }
  
  CropCanvasLib.prototype.showElement = function(element){
    element.style.display = 'block'
    element.classList.remove('hide');
  }
  
  CropCanvasLib.prototype.hideElement = function(element){
    element.classList.remove('show');
    element.classList.add('hide');
  }
  
  CropCanvasLib.prototype.uploadImage = function(){
    this.clearCanvasArea();
    var canvasSrc;
    var file = this.inputEle.files[0];
    var reader = new window.FileReader()
    this.imageObject = new Image();
    reader.onload = (event) => {
      reader.onload = null
      canvasSrc = event.target.result;
      this.imageObject.src = canvasSrc;
      this.imageObjectSrc = canvasSrc;
    }
    reader.readAsDataURL(file);
  
    this.imageObject.onload = () => {
      this.cropCanvasContext.drawImage(this.imageObject, 0, 0, this.imageObject.width, this.imageObject.height, 0, 0, 568, 320);
    }
    if(!this.cropCanvas.visible){
      this.cropCanvas.style.display = 'block'
    }
    if(this.imageEle){
      this.imageEle.style.display = 'none'
    }
  }
  
  CropCanvasLib.prototype.clearCanvasArea = function(){
    this.filterApplied = false;
    if(this.filterCanvas && this.filterCanvas.visible){
      this.filterCanvas.getContext('2d').clearRect(0, 0, this.filterCanvas.width, this.filterCanvas.height);
      this.filterCanvas.style.display = 'none';
    }
    if(this.cropDiv && this.cropDiv.visible){
      this.cropDiv.remove();
    }
    if(this.cropCanvas.visible){
      this.cropCanvasContext.clearRect(0, 0, 568, 320);
    }
  }
  
  CropCanvasLib.prototype.applyFilter = function(filter){
    this.filterApplied = true;
    var filterElement;
    if(this.filterCanvas && this.filterCanvas.offsetParent !== null){
      console.log(this.filterCanvas.width);
      filterElement = this.filterCanvas;
    }else if(this.cropCanvas.width && this.cropCanvas.offsetParent !== null){
      filterElement = this.cropCanvas;
    }else{
      filterElement = this.imageEle;
    }
    filterElement.style.filter = ""
    filterElement.style.webkitFilter = ""
    switch(filter){
      case 'rainy':
        filterElement.style.filter = 'grayscale(0.4) saturate(0.7)';
        filterElement.style.webkitFilter = 'grayscale(0.4) saturate(0.7)';
        break;
      case 'dawn':
        filterElement.style.filter = 'hue-rotate(-20deg)';
        filterElement.style.webkitFilter = 'hue-rotate(-20deg)';
        break;
      case 'evening':
        filterElement.style.filter = 'hue-rotate(-40deg)';
        filterElement.style.webkitFilter  = 'hue-rotate(-40deg)';
        break;
      case 'lively':
        filterElement.style.filter = 'brightness(1.2) contrast(1.05) saturate(1.4)';
        filterElement.style.webkitFilter = 'brightness(1.2) contrast(1.05) saturate(1.4)';
      break; 
      case 'saturate':
        filterElement.style.filter = 'saturate(1.5) hue-rotate(-50deg) brightness(1.05)';
        filterElement.style.webkitFilter = 'saturate(1.5) hue-rotate(-50deg) brightness(1.05)';
      break;
      case 'grayscale':
        filterElement.style.filter = 'grayscale(1)'
        filterElement.style.webkitFilter = 'grayscale(1)'
      break; 
      case 'sepia':
        filterElement.style.filter = 'sepia(1)'
        filterElement.style.webkitFilter = 'sepia(1)'
      break;
    }
  };

  window.CropCanvasLib = CropCanvasLib;
})();

