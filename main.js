
let text, textArr;
let submit = document.getElementById('submit'); // accessing submit button
let arr3D = new Array(); // initilising 3D cude
let numCube; // stores number of cubes to make
let cubeBox = document.querySelector('.cube');
let encryptedCube = document.querySelector('.encrepted');
let key = "";
let UIKey = document.getElementById('key');
let UIEncryptedValue = document.getElementById('encrypt_value');
let decryptBtn = document.getElementById('decrypt');

submit.addEventListener('click', () =>{
    text = document.getElementById('value').value; // access the value written in the text area
    // convert text to array
    
    textArr = Array.from(text);
    
    // calculate how many cubes to make
    
    numCube = Math.ceil(textArr.length / 8);
    
    // make cubes
    arr3D = arrayBreak(textArr, numCube);
    
    // Priniting cubes
    cubeBox.innerHTML = '';
    printCube(arr3D, numCube);
    
    // rotate randomly

    for(let i = 0; i < numCube; i++) {
        const turnDirection = randomTrun();
        const cubeNum = i;
        key += `${cubeNum}:${turnDirection},`;
        arr3D[cubeNum] = rotate(arr3D, cubeNum, turnDirection);
    }   
    key = key.slice(0, key.length - 1);
    // store rotations as key
    UIKey.textContent = '';
    UIKey.value = key;
    key = '';

    // print encrypt text an cube
    
    UIEncryptedValue.value = getData(arr3D, numCube);
    
    printCube(arr3D, numCube, true);
    console.log('encrypted cube: ' + arr3D);
 // decrypt data on click decrypt button;
});

decryptBtn.addEventListener('click', () => {
    
    text = document.getElementById('encrypt_value').value;
    textArr = Array.from(text);
    numCube = Math.ceil(textArr.length / 8);
    arr3D = arrayBreak(textArr, numCube);
    let result = '';
    key = document.getElementById('key').value;
    let step = decrypt(key, arr3D);

    for(let i = 0; i < numCube; i++) {
        arr3D[i] = decryptCube(arr3D, step, i);
    }
    
    for(let i = 0; i < numCube; i++) {
        result += arr3D[i].join('');
    }
    document.getElementById('value').value = result;
});

 

 // break big array set of eight value array

const arrayBreak = (arr, numOfCub) => {
    
    // initilising start and end point
    let result = new Array(), start = 0, end = 8;
    for(let i = 0; i < numOfCub; i++) {
 
        if(arr.slice(start, end).length < 8)
        {
            for(let j = start; j <= end; j++) {
                if(arr[j] == undefined) {
                    arr[j] = '';
                }
            }        
        }
        result.push(arr.slice(start, end)); 
        
        start = end;
        end = start + 8;
    }

    return result;
}

// render html function

const printCube = (cubes, numOfCub, isEncrypt) => { 
    let markup;
    for(let i = 0; i < numOfCub; i++) {
    markup = `
    <pre>      
            
                        ${cubes[i][5]} . . . . . . . . . ${cubes[i][6]}
                       ..                  ..
                      . .                 . .
                     .  .                .  .
                    .   .               .   .
                   .    .              .    .
                   ${cubes[i][1]} . . . . . . . . .${cubes[i][2]}
                   .    .             .     .
                   .    .             .     .
                   .    ${cubes[i][4]} . . . . . . . . . ${cubes[i][7]}
                   .   .              .    .
                   .  .               .   .
                   . .                .  .
                   ..                 . .
                   ${cubes[i][0]} . . . . . . . .  ${cubes[i][3]}                 

    </pre>`
        if(isEncrypt === true) {
            encryptedCube.insertAdjacentHTML('beforeend', markup);
        }
        else {
            cubeBox.insertAdjacentHTML('beforeend', markup);
        }
    }
};

// extract text from cube

const getData = (cubes, numOfCub) => {
    let value = '';
    for(let i = 0; i < numOfCub; i++) {
        cubes[i].forEach((el) => {
            value += el;
        });
    }
    return value;
}

// Rotate functions

const rotate = (cubes, cubeNo, direction) => {
    let value = new Array();
    if (direction === 'U') {          // dirction UP
        value[0] = cubes[cubeNo][4];
        value[1] = cubes[cubeNo][0];
        value[2] = cubes[cubeNo][3];
        value[3] = cubes[cubeNo][7];
        value[4] = cubes[cubeNo][5];
        value[5] = cubes[cubeNo][1];
        value[6] = cubes[cubeNo][2];
        value[7] = cubes[cubeNo][6];        
    
    } else if(direction === 'D') {  // direction down
        value[0] = cubes[cubeNo][1];
        value[1] = cubes[cubeNo][5];
        value[2] = cubes[cubeNo][6];
        value[3] = cubes[cubeNo][2];
        value[4] = cubes[cubeNo][0];
        value[5] = cubes[cubeNo][4];
        value[6] = cubes[cubeNo][7];
        value[7] = cubes[cubeNo][3];        
    
    } else if (direction === 'L') { // direction left
        value[0] = cubes[cubeNo][3];
        value[1] = cubes[cubeNo][2];
        value[2] = cubes[cubeNo][6];
        value[3] = cubes[cubeNo][7];
        value[4] = cubes[cubeNo][0];
        value[5] = cubes[cubeNo][1];
        value[6] = cubes[cubeNo][5];
        value[7] = cubes[cubeNo][4];        
    
    } else if (direction == 'R') { // right
        value[0] = cubes[cubeNo][4];
        value[1] = cubes[cubeNo][5];
        value[2] = cubes[cubeNo][1];
        value[3] = cubes[cubeNo][0];
        value[4] = cubes[cubeNo][7];
        value[5] = cubes[cubeNo][6];
        value[6] = cubes[cubeNo][2];
        value[7] = cubes[cubeNo][3];        
    
    } 

    return value;
};

const randomTrun = () => {
    const num = Math.round(Math.random()*3); 
    if(num === 0)
        return 'U';
    if(num === 1) 
        return 'D';
    if(num === 2)
        return 'L';
    if(num === 3)
        return 'R';
}
const decrypt  = (key, cube) => {
    let step = new Array();
    key = key.split(',');
    key.forEach((el) => {
        step.push(el.split(':'));
    });
    return step;
}

const decryptCube = (cube, step, cubeNo) => {
    let direction = step[cubeNo][1];
    if(direction === 'U'){
        direction = 'D';
    } else if (direction === 'D') {
        direction = 'U';
    } else if (direction === 'L') {
        direction = 'R';
    } else if (direction === 'R') {
        direction = 'L';
    }
    cube[cubeNo] = rotate(cube, cubeNo, direction);
    return cube[cubeNo];
};