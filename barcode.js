const cameraFeed = document.getElementById("cameraFeed");
const captureButton = document.getElementById("captureButton");
const scanButton = document.getElementById("scanButton");
const resultElem = document.getElementById("result");

function decode(src, readers) {
  return new Promise((resolve, reject) => {
    Quagga.decodeSingle(
      {
        src: src,
        numOfWorkers: navigator.hardwareConcurrency || 1,
        decoder: {
          readers: readers,
        },
      },
      (result) => {
        setTimeout(() => {
          if (result && result.codeResult) {
            resolve(`Barcode for ${readers} : ${result.codeResult.code}`);
          } else {
            resolve(`No barcode detected for ${readers}`);
          }
        }, 0);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

const constraints = {
  video: {
    facingMode: { exact: "environment" },
  },
};

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  cameraFeed.srcObject = stream;
  cameraFeed.play();
});

const func = () => {
  const canvas = document.createElement("canvas");
  canvas.width = cameraFeed.videoWidth;
  canvas.height = cameraFeed.videoHeight;
  canvas.getContext("2d").drawImage(cameraFeed, 0, 0);
  const imgUrl = canvas.toDataURL();
  return imgUrl;
};

scanButton.addEventListener("click", async () => {
  imgUrl = func();
  let readers = [
    "upc_e_reader",
    "upc_reader",
    "ean_8_reader",
    "ean_reader",
    "code_128_reader",
    "code_39_reader",
    // "code_39_vin_reader",
    // "codabar_reader",
    // "i2of5_reader",
    // "2of5_reader",
    "code_93_reader",
  ];

  for (let i = 0; i < readers.length; i++) {
    let barcodeArray = [];
    for (let j = 0; j < 30; j++) {
      const reader = readers[i];
      const result = await decode(imgUrl, [reader]);
      resultElem.textContent = result;
      if (result.includes("Barcode")) {
        barcodeArray.push(result);
      }
    }
    const item = validate(barcodeArray);
    if (item) {
      alert(item);
      break;
    } else if (i === readers.length - 1) {
      alert("Unable to detect barcode");
    }
  }
});

function validate(arr) {
  arr.sort();
  let currElem = arr[0];
  let currFreq = 1;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === currElem) {
      currFreq++;
      if (currFreq > 4) {
        return currElem;
      }
    } else {
      currElem = arr[i];
      currFreq = 1;
    }
  }
  return null;
}
