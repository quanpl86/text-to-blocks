// Giai đoạn 1: Bản đồ Opcode
// Ánh xạ từ cú pháp scratchblocks (tiếng Anh) sang opcode chính thức của Scratch.

const opcodeMap = {
    // Events
    'when green flag clicked': 'event_whenflagclicked',
    // Motion
    'move () steps': 'motion_movesteps',
    'turn cw () degrees': 'motion_turnright',
    'turn ccw () degrees': 'motion_turnleft',
    'go to x: () y: ()': 'motion_gotoxy',
    'glide () secs to x: () y: ()': 'motion_glidesecstoxy', // <-- Thêm khối glide
    // Looks
    'say [] for () seconds': 'looks_sayforsecs',
    'say []': 'looks_say',
    'think []': 'looks_think',
    'think [] for () seconds': 'looks_thinkforsecs',
    'next costume': 'looks_nextcostume',
    'show': 'looks_show',
    'hide': 'looks_hide',
    // Control
    'wait () seconds': 'control_wait',
    'wait until <>': 'control_wait_until',
    'forever': 'control_forever',
    'repeat ()': 'control_repeat',
    'if <> then': 'control_if',
    'if <> then else': 'control_if_else',
    // Data
    'set [] to []': 'data_setvariableto',
    // Operators
    '(pick random () to ())': 'operator_random', // <-- Thêm khối random
    '(join [] [])': 'operator_join',
    '(() + ())': 'operator_add',
    '(() - ())': 'operator_subtract',
    '(() * ())': 'operator_multiply',
    '(() / ())': 'operator_divide',
    '<[] = []>': 'operator_equals',
    '<[] > []>': 'operator_gt',
    '<[] < []>': 'operator_lt',
    // Sensing
    '(answer)': 'sensing_answer',
    'ask [] and wait': 'sensing_askandwait',
};

// Ánh xạ từ opcode sang tên và thứ tự của các INPUTS
const inputMap = {
    'motion_movesteps': { STEPS: 0 },
    'motion_turnright': { DEGREES: 0 },
    'motion_turnleft': { DEGREES: 0 },
    'motion_gotoxy': { X: 0, Y: 1 },
    'motion_glidesecstoxy': { SECS: 0, X: 1, Y: 2 }, // <-- Thêm input cho glide
    'looks_sayforsecs': { MESSAGE: 0, SECS: 1 },
    'looks_say': { MESSAGE: 0 },
    'looks_thinkforsecs': { MESSAGE: 0, SECS: 1 },
    'looks_think': { MESSAGE: 0 },
    'control_repeat': { TIMES: 0 },
    'control_if': { CONDITION: 0 },
    'control_if_else': { CONDITION: 0 },
    'control_wait': { DURATION: 0 },
    'control_wait_until': { CONDITION: 0 },
    'data_setvariableto': { VALUE: 1 },
    'operator_random': { FROM: 0, TO: 1 }, // <-- Thêm input cho random
    'operator_join': { STRING1: 0, STRING2: 1 },
    'operator_add': { NUM1: 0, NUM2: 1 },
    'operator_subtract': { NUM1: 0, NUM2: 1 },
    'operator_multiply': { NUM1: 0, NUM2: 1 },
    'operator_divide': { NUM1: 0, NUM2: 1 },
    'operator_equals': { OPERAND1: 0, OPERAND2: 1 },
    'operator_gt': { OPERAND1: 0, OPERAND2: 1 },
    'operator_lt': { OPERAND1: 0, OPERAND2: 1 },
    'sensing_askandwait': { QUESTION: 0 },
};

// Ánh xạ từ opcode sang tên và thứ tự của các FIELDS (ví dụ: tên biến)
const fieldMap = {
    'data_setvariableto': { VARIABLE: 0 },
}