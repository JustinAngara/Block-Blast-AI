// general structures for the game
// there will be variations, so we need to either reverse or mirror or both
// 13 unique items
let items = [
    [[1, 1]],
    [
        [1, 1],
        [1, 1],
    ],
    [
        [0, 1],
        [1, 1],
    ],
    [
        [0, 1],
        [1, 0],
    ],
    [[1, 1, 1]],
    [
        [0, 0, 1],
        [1, 1, 1],
    ],
    [
        [1, 1, 1],
        [1, 1, 1],
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
    ],
    [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
    ],
    [[1, 1, 1, 1]],
    [[1, 1, 1, 1, 1]],
    [
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 1],
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
    ],
];
let testBoard = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
];
const logic = {
    board: testBoard,
    items: [],

    // mutator stuff
    initBoard: function () {
        console.log("called");
        this.board = generateBoard();
    },
    initItems: function () {
        this.items = generateItems();
    },

    // getter stuff
    getBoard: function () {
        return this.board;
    },
    getItem: function () {
        return getItem();
    },
    getItems: function () {
        return this.items;
    },
    checkForBlast: function () {
        checkForBlast();
    },
    insert: function (block) {
        return insertion(block);
        // checkForBlast();
    },
};

/**
 * block
 * row col vals, top left
 * block.x
 * block.y
 *
 * x can be 1 or 0, with any size and height
 * block.board
 * [
 *      [x,x,x],
 *      [x,x,x],
 *      [x,x,x],
 * ]
 *
 * example:
 * [
 *      [1,0,0],
 *      [1,1,0],
 *      [0,1,1],
 * ]
 * parse to coords -> (1,0), (1,1), (2,2)
 * @return t/f based on if insertion was complete
 */
let insertion = (block) => {
    let tempBoard = logic.board;
    let x1 = block.x;
    let y1 = block.y;

    let height = block.board.length;
    let width = block.board[0].length;
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {

            try{
                // Check for overlap
                if (block.board[row][col] === 1 && // Block has 1
                    tempBoard[row + y1][col + x1] === 1) {
                    return false; // Overlapping blocks
                }
            } catch(e){
                return false;
            }
        }
    }

    // No overlap, proceed with insertion
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (block.board[row][col] === 1) {
                tempBoard[row + y1][col + x1] = 1;
            }
        }
    }

    // insertion was good, so update board then check for blast to update logic.board
    logic.board = tempBoard;
    checkForBlast();

    return true;
};

let generateBoard = () => {
    let t = [];
    for (let i = 0; i < 8; i++) {
        let z = [];
        for (let j = 0; j < 8; j++) {
            z.push(0);
        }
        t.push(z);
    }
    console.log(t);
    return t;
};

let generateItems = () => {
    let temp = []; // this will be 3 items
    for (let i = 0; i < 1; i++) {
        temp.push(getItem());
    }
    return temp;
};
let getItem = () => {
    // unique shape
    let shape = items[Math.floor(Math.random() * items.length)];
    // returns a random variant of that unique shape
    return getVariant(shape);
};

// general format of input
/*
[
    [0,1,0],
    [1,1,1],
]
*/
let getVariant = (item) => {
    // reflect horizontally
    if (Math.random() < 0.5) {
        item = item.map((row) => row.slice().reverse());
    }

    // reflect vertically
    if (Math.random() < 0.5) {
        item = item.slice().reverse();
    }
    if (Math.random() < 0.5) {
        item = transpose(item);
    }
    console.log(`this is item`);
    console.log(item);
    return item;
};
let transpose = (matrix) => {
    if (!matrix || matrix.length === 0) {
        return [];
    }

    const numRows = matrix.length;
    const numCols = matrix[0].length;

    // Initialize the transposed matrix with the correct dimensions
    const transposed = Array(numCols)
        .fill(null)
        .map(() => Array(numRows).fill(null));

    // Iterate through the original matrix and populate the transposed matrix
    matrix.forEach((row, i) => {
        row.forEach((element, j) => {
            transposed[j][i] = element;
        });
    });

    return transposed;
};
/*
if there are any rows or columns filled with 1, track the row and column indecies
then fill each row and columns with 0s, update boarrd
rowIndiciies: [x,x,x,x,x,x,x,x] -> x can be DNE, or indicie location of where the row should be able to be removed
*/
let checkForBlast = () => {
    let columnIndicies = [];
    let rowIndicies = [];

    // row major
    for (let row = 0; row < logic.board.length; row++) {
        let valid = true;
        for (let col = 0; col < logic.board[0].length; col++) {
            if (logic.board[row][col] === 0) {
                valid = false;
            }
        }
        if (valid) {
            rowIndicies.push(row);
        }
    }

    // column major
    for (let col = 0; col < logic.board[0].length; col++) {
        let valid = true;
        for (let row = 0; row < logic.board.length; row++) {
            if (logic.board[row][col] === 0) {
                valid = false;
            }
        }
        if (valid) {
            columnIndicies.push(col);
        }
    }

    console.log("before");
    console.log(logic.getBoard());
    console.log(`
        row: ${rowIndicies.length}
        col: ${columnIndicies.length}
    `);

    executeBlast(rowIndicies, columnIndicies);
    console.log("after");
    console.log(logic.getBoard());
};

/*
    row array, remove all those rows and replace with 0's
    col array, remove all those cols and replace with 0's
    the rows and cols arrs indicies
*/
let executeBlast = (row, col) => {
    for (let i = 0; i < row.length; i++) {
        for (let j = 0; j < logic.board[0].length; j++) {
            logic.board[row[i]][j] = 0;
        }
    }
    for (let i = 0; i < col.length; i++) {
        for (let j = 0; j < logic.board.length; j++) {
            logic.board[j][col[i]] = 0;
        }
    }
};

export { logic };
