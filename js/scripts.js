// Shared client-side functions for image tools
function readImageFile(file, onloadImg){
  const reader = new FileReader();
  reader.onload = function(e){
    const img = new Image();
    img.onload = function(){ onloadImg(img); };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Single image convert
function convertImageOnPage(fileInputId, format, downloadId, previewId){
  const file = document.getElementById(fileInputId).files[0];
  if(!file){ alert('Please choose an image file.'); return; }
  readImageFile(file, function(img){
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img,0,0);
    canvas.toBlob(function(blob){
      const dl = document.getElementById(downloadId);
      dl.href = URL.createObjectURL(blob);
      dl.download = 'converted_image.'+format;
      dl.style.display = 'inline-block';
      dl.textContent = 'Download '+format.toUpperCase();
      const prev = document.getElementById(previewId);
      prev.src = dl.href; prev.style.display='block';
    }, 'image/'+format);
  });
}

// Resize image
function resizeImageOnPage(fileInputId, widthId, heightId, downloadId, previewId){
  const file = document.getElementById(fileInputId).files[0];
  const w = parseInt(document.getElementById(widthId).value);
  const h = parseInt(document.getElementById(heightId).value);
  if(!file || !w || !h){ alert('Choose image and enter width/height'); return; }
  readImageFile(file, function(img){
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img,0,0,w,h);
    canvas.toBlob(function(blob){
      const dl = document.getElementById(downloadId);
      dl.href = URL.createObjectURL(blob);
      dl.download = 'resized_image.png';
      dl.style.display = 'inline-block';
      dl.textContent = 'Download PNG';
      const prev = document.getElementById(previewId);
      prev.src = dl.href; prev.style.display='block';
    }, 'image/png');
  });
}

// Multiple images convert
function convertMultipleImagesOnPage(fileInputId, format, containerId){
  const files = document.getElementById(fileInputId).files;
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  if(!files.length){ alert('Select one or more images'); return; }
  Array.from(files).forEach((file, i) => {
    readImageFile(file, function(img){
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img,0,0);
      canvas.toBlob(function(blob){
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'converted_'+(i+1)+'.'+format;
        a.className = 'download-link';
        a.textContent = 'Download '+(i+1);
        container.appendChild(a);
      }, 'image/'+format);
    });
  });
}
