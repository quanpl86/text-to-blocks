// Giai đoạn 2 & 3: Bộ chuyển đổi AST và Đóng gói SB3

/**
 * Tạo một ID ngẫu nhiên và duy nhất cho mỗi khối.
 * Scratch sử dụng chuỗi 20 ký tự.
 */
function generateBlockId() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 20; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Chuyển đổi một giá trị đầu vào (input) thành định dạng của Scratch. (ĐÃ NÂNG CẤP)
 * @param {any} value - Giá trị từ AST (có thể là chuỗi, số, hoặc một khối lệnh khác).
 * @param {string} parentId - ID của khối cha chứa input này.
 * @param {Object} allBlocks - Tham chiếu đến đối tượng chứa tất cả các khối đã xử lý.
 * @returns {Array} - Cấu trúc input cho project.json.
 */
function processInputValue(value, parentId, allBlocks) {
    // Nếu giá trị đầu vào là một khối lệnh (AST object)
    if (typeof value === 'object' && value.constructor.name === 'Block') {
        // Gọi đệ quy để xử lý khối lồng nhau
        // Quan trọng: Phải truyền `allBlocks` một cách tường minh để đảm bảo các khối con
        // được thêm vào đúng đối tượng `allBlocks` gốc.
        const localNestedBlocks = transformScript([value], parentId, allBlocks);
        const firstBlockId = Object.keys(localNestedBlocks)[0];
        // Loại 3 là khối reporter lồng nhau không có shadow
        return [3, firstBlockId, ""];
    }

    // Nếu là một giá trị đơn giản (số hoặc chuỗi)
    const num = parseFloat(value);
    if (!isNaN(num) && isFinite(num)) {
        // Loại 1 là shadow block, loại 4 là shadow number
        return [1, [4, value.toString()]];
    }
    // Loại 10 là shadow text
    return [1, [10, value.toString()]];
}

/**
 * Hàm đệ quy để biến đổi một cây cú pháp (AST) từ scratchblocks thành các đối tượng khối. (ĐÃ VIẾT LẠI)
 * @param {Array} scriptAst - Một mảng các khối từ scratchblocks.parse().scripts.
 * @param {string|null} topLevelParentId - ID của khối cha.
 * @param {Object} allBlocks - Tham chiếu đến đối tượng chứa tất cả các khối.
 * @returns {Object} - Trả về các khối được tạo cục bộ trong lần gọi này (localBlocks).
 */
function transformScript(scriptAst, topLevelParentId = null, allBlocks = {}) {
    const localBlocks = {};
    let prevBlockId = null;

    scriptAst.forEach((blockAst, index) => {
        const blockId = generateBlockId();
        
        // BỎ QUA CÁC KHỐI KHÔNG HỢP LỆ (ví dụ: khối 'end')
        if (!blockAst || !blockAst.selector) {
            return; // Chuyển sang khối tiếp theo
        }

        // Tạo selector để tra cứu opcode, sử dụng blockAst.selector
        const selector = blockAst.selector.replace(/%s|%b|%c/g, (match) => {
            if (match === '%s') return '[]';
            if (match === '%b') return '<>';
            return match;
        });

        const opcode = opcodeMap[selector];
        if (!opcode) {
            console.warn(`Opcode không tìm thấy cho: ${selector}`);
            return; // Bỏ qua khối không xác định
        }

        const newBlock = {
            opcode: opcode,
            next: null,
            parent: prevBlockId || topLevelParentId,
            inputs: {},
            fields: {},
            shadow: false,
            topLevel: index === 0 && !topLevelParentId,
        };

        // Xử lý inputs dựa trên inputMap
        const inputMapping = inputMap[opcode];
        if (inputMapping && blockAst.args) {
            for (const inputName in inputMapping) {
                const argIndex = inputMapping[inputName];
                const argValue = blockAst.args[argIndex];
                if (argValue !== undefined) {
                    newBlock.inputs[inputName] = processInputValue(argValue, blockId, allBlocks);
                }
            }
        }
        
        // Xử lý fields (ví dụ: tên biến) dựa trên fieldMap
        const fieldMapping = fieldMap[opcode];
        if (fieldMapping && blockAst.fields) {
            for (const fieldName in fieldMapping) {
                const fieldIndex = fieldMapping[fieldName];
                const fieldValue = blockAst.fields[fieldIndex];
                if (fieldValue !== undefined) {
                    // TODO: Cần xử lý phức tạp hơn để tạo biến trong target, ở đây chỉ là ví dụ
                    newBlock.fields[fieldName] = [fieldValue.value, null]; // [tên biến, id biến]
                }
            }
        }

        // Xử lý các khối con (substacks), ví dụ như bên trong 'forever' hoặc 'repeat'
        if (blockAst.substack) {
            const substackBlocks = transformScript(blockAst.substack.blocks, blockId, allBlocks);
            if (Object.keys(substackBlocks).length > 0) {
                const firstSubstackBlockId = Object.keys(substackBlocks)[0];
                newBlock.inputs.SUBSTACK = [2, firstSubstackBlockId];
            }
        }
        if (blockAst.substack2) { // Dành cho khối 'if-else'
            const substack2Blocks = transformScript(blockAst.substack2.blocks, blockId, allBlocks);
            if (Object.keys(substack2Blocks).length > 0) {
                const firstSubstackBlockId2 = Object.keys(substack2Blocks)[0];
                newBlock.inputs.SUBSTACK2 = [2, firstSubstackBlockId2];
            }
        }

        // Liên kết với khối trước đó
        if (prevBlockId) {
            allBlocks[prevBlockId].next = blockId;
        }

        allBlocks[blockId] = newBlock;
        localBlocks[blockId] = newBlock;
        prevBlockId = blockId;
    });

    return localBlocks;
}

/**
 * Xây dựng đối tượng project.json hoàn chỉnh từ các khối đã chuyển đổi.
 * @param {Object} blocks - Đối tượng chứa tất cả các khối.
 * @returns {Object} - Đối tượng project.json.
 */
function buildProjectJson(blocks) {
    // Đây là một khuôn mẫu project.json tối giản
    const projectTemplate = {
        "targets": [
            {
                "isStage": true,
                "name": "Stage",
                "variables": {}, "lists": {}, "broadcasts": {}, "blocks": {}, "comments": {},
                "currentCostume": 0, "costumes": [{ "name": "backdrop1", "dataFormat": "svg", "assetId": "cd21514d0531fdffb22204e0ec5ed84a", "md5ext": "cd21514d0531fdffb22204e0ec5ed84a.svg", "rotationCenterX": 240, "rotationCenterY": 180 }],
                "sounds": [], "volume": 100, "layerOrder": 0, "tempo": 60, "videoTransparency": 50, "videoState": "on", "textToSpeechLanguage": null
            },
            {
                "isStage": false,
                "name": "Sprite1",
                "variables": {}, "lists": {}, "broadcasts": {},
                "blocks": blocks, // <-- Nhúng các khối của chúng ta vào đây
                "comments": {},
                "visible": true, "x": 0, "y": 0, "size": 100, "direction": 90, "draggable": false, "rotationStyle": "all around",
                "currentCostume": 0,
                "costumes": [{ "name": "costume1", "assetId": "bcf454acf82e4504149f7ffe07081dbc", "md5ext": "bcf454acf82e4504149f7ffe07081dbc.svg", "dataFormat": "svg", "rotationCenterX": 48, "rotationCenterY": 50 }],
                "sounds": [{ "name": "Meow", "assetId": "83c36d806dc92327b9e7049a565c6bff", "dataFormat": "wav", "rate": 48000, "sampleCount": 40681, "md5ext": "83c36d806dc92327b9e7049a565c6bff.wav" }],
                "volume": 100, "layerOrder": 1
            }
        ],
        "monitors": [],
        "extensions": [],
        "meta": { "semver": "3.0.0", "vm": "0.2.0-prerelease.20220712210021", "agent": "Mozilla/5.0 ... " }
    };
    return projectTemplate;
}

/**
 * Hàm chính để điều phối toàn bộ quá trình.
 * @param {string} scratchblocksCode - Mã nguồn từ editor.
 */
async function exportToSb3(scratchblocksCode) {
    try {
        // Giai đoạn 2: Phân tích và Biến đổi
        console.log("Bắt đầu phân tích mã scratchblocks...");
        const parsed = scratchblocks.parse(scratchblocksCode, { languages: ['en'] });

        const allBlocks = {};
        parsed.scripts.forEach(script => {
            transformScript(script.blocks, null, allBlocks);
        });
        console.log("Các khối đã được chuyển đổi:", allBlocks);

        // Giai đoạn 3: Xây dựng project.json
        console.log("Đang xây dựng project.json...");
        const projectJson = buildProjectJson(allBlocks);

        // Giai đoạn 3: Đóng gói thành tệp ZIP
        console.log("Đang đóng gói thành tệp .sb3...");
        const zip = new JSZip();
        zip.file("project.json", JSON.stringify(projectJson));

        // (Tùy chọn) Thêm các tệp tài sản mặc định.
        // Trong ví dụ này, chúng ta sẽ bỏ qua để giữ cho nó đơn giản.
        // Một hệ thống thực tế sẽ cần fetch các tệp này.

        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, "my-project.sb3");
        console.log("Hoàn thành!");

    } catch (error) {
        console.error("Đã xảy ra lỗi trong quá trình xuất file .sb3:", error);
        alert("Đã xảy ra lỗi: " + error.message);
    }
}