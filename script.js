document.addEventListener('DOMContentLoaded', function() {
    // =========================================================================================
    // BỘ MÁY DỊCH THUẬT ĐỆ QUY MỚI
    // =========================================================================================
    const translationMap = [
        // Motion
        ['move (%s) steps', 'di chuyển (%s) bước'],
        ['turn cw (%s) degrees', 'xoay ↻ (%s) độ'],
        ['turn ccw (%s) degrees', 'xoay ↺ (%s) độ'],
        ['point in direction (%s v)', 'đặt hướng bằng (%s v)'],
        ['point towards [%s v]', 'hướng về phía [%s v]'],
        ['go to x: (%s) y: (%s)', 'đi tới điểm x: (%s) y: (%s)'],
        ['go to [%s v]', 'đi tới [%s v]'],
        ['glide (%s) secs to x: (%s) y: (%s)', 'lướt trong (%s) giây tới điểm x: (%s) y: (%s)'],
        ['change x by (%s)', 'thay đổi x một lượng (%s)'],
        ['set x to (%s)', 'đặt x thành (%s)'],
        ['change y by (%s)', 'thay đổi y một lượng (%s)'],
        ['set y to (%s)', 'đặt y thành (%s)'],
        ['if on edge, bounce', 'bật lại nếu chạm cạnh'],
        ['set rotation style [%s v]', 'đặt kiểu xoay [%s v]'],
        ['(x position)', '(tọa độ x)'],
        ['(y position)', '(tọa độ y)'],
        ['(direction)', '(hướng)'],
        // Looks
        ['say [%s] for (%s) seconds', 'nói [%s] trong (%s) giây'],
        ['say [%s]', 'nói [%s]'],
        ['think [%s] for (%s) seconds', 'nghĩ [%s] trong (%s) giây'],
        ['think [%s]', 'nghĩ [%s]'],
        ['show', 'hiện'],
        ['hide', 'ẩn'],
        ['switch costume to [%s v]', 'đổi trang phục thành [%s v]'],
        ['next costume', 'trang phục kế tiếp'],
        ['switch backdrop to [%s v]', 'đổi phông nền thành [%s v]'],
        ['next backdrop', 'phông nền kế tiếp'],
        ['change size by (%s)', 'thay đổi kích thước một lượng (%s)'],
        ['set size to (%s) %', 'đặt kích thước bằng (%s) %'],
        ['change [%s v] effect by (%s)', 'thay đổi hiệu ứng [%s v] một lượng (%s)'],
        ['set [%s v] effect to (%s)', 'đặt hiệu ứng [%s v] thành (%s)'],
        ['clear graphic effects', 'xóa các hiệu ứng đồ họa'],
        ['go to [%s v] layer', 'đi tới lớp phía [%s v]'],
        ['go [%s v] (%s) layers', 'di chuyển tới (%s) lớp'],
        ['(costume [%s v])', '(trang phục [%s v])'],
        ['(backdrop [%s v])', '(phông nền [%s v])'],
        ['(size)', '(kích thước)'],
        // Sound
        ['play sound [%s v] until done', 'phát âm thanh [%s v] đến hết'],
        ['start sound [%s v]', 'bắt đầu âm thanh [%s v]'],
        ['stop all sounds', 'dừng mọi âm thanh'],
        ['change [%s v] effect by (%s)', 'thay đổi hiệu ứng [%s v] một lượng (%s)'],
        ['set [%s v] effect to (%s)', 'đặt hiệu ứng [%s v] thành (%s)'],
        ['clear sound effects', 'xóa các hiệu ứng âm thanh'],
        ['change volume by (%s)', 'thay đổi âm lượng một lượng (%s)'],
        ['set volume to (%s) %', 'đặt âm lượng bằng (%s) %'],
        ['(volume)', '(âm lượng)'],
        // Events
        ['when green flag clicked', 'khi bấm vào ⚑'],
        ['when [%s v] key pressed', 'khi bấm phím [%s v]'],
        ['when this sprite clicked', 'khi bấm vào nhân vật này'],
        ['when backdrop switches to [%s v]', 'khi phông nền chuyển thành [%s v]'],
        ['when [%s v] > (%s)', 'khi [%s v] > (%s)'],
        ['when I receive [%s v]', 'khi tôi nhận được [%s v]'],
        ['broadcast [%s v]', 'phát tin [%s v]'],
        ['broadcast [%s v] and wait', 'phát tin [%s v] và đợi'],
        // Controls
        ['wait (%s) seconds', 'đợi (%s) giây'],
        ['repeat (%s)', 'lặp lại (%s)'],
        ['forever', 'liên tục'],
        ['if <> then', 'nếu <> thì'],
        ['else', 'nếu không'],
        ['wait until <>', 'đợi cho đến khi <>'],
        ['repeat until <>', 'lặp lại cho đến khi <>'],
        ['stop [%s v]', 'dừng lại [%s v]'],
        ['when I start as a clone', 'khi tôi bắt đầu là một bản sao'],
        ['create clone of [%s v]', 'tạo bản sao của [%s v]'],
        ['delete this clone', 'xóa bản sao này'],
        ['end', 'end'],
        // Sensing
        ['<touching [%s v] ?>', '<đang chạm [%s v] ?>'],
        ['<touching color (%s) ?>', '<đang chạm màu (%s) ?>'],
        ['<color (%s) is touching (%s) ?>', '<màu (%s) đang chạm (%s) ?>'],
        ['(distance to [%s v])', '(khoảng cách đến [%s v])'],
        ['ask [%s] and wait', 'hỏi [%s] và đợi'],
        ['(answer)', '(trả lời)'],
        ['<key [%s v] pressed?>', '<phím [%s v] được bấm ?>'],
        ['<mouse down?>', '<chuột đang được nhấn ?>'],
        ['(mouse x)', '(x của chuột)'],
        ['(mouse y)', '(y của chuột)'],
        ['(loudness)', '(độ lớn âm thanh)'],
        ['(timer)', '(đồng hồ bấm giờ)'],
        ['reset timer', 'đặt lại đồng hồ bấm giờ'],
        ['([%s v] of [%s v])', '([%s v] của [%s v])'],
        ['(current [%s v])', '([%s v] hiện tại)'],
        ['(days since 2000)', '(số ngày từ năm 2000)'],
        ['(username)', '(tên người dùng)'],
        // Operators
        ['(() + ())', '(() + ())'],
        ['(() - ())', '(() - ())'],
        ['(() * ())', '(() * ())'],
        ['(() / ())', '(() / ())'],
        ['(pick random (%s) to (%s))', 'lấy ngẫu nhiên từ (%s) đến (%s)'],
        ['<[] > []>', '<[] > []>'],
        ['<[] < []>', '<[] < []>'],
        ['<[] = []>', '<[] = []>'],
        ['<<> and <>>', '<<> và <>>'],
        ['<<> or <>>', '<<> hoặc <>>'],
        ['<not <>>', '<không <>>'],
        ['(join [%s] [%s])', 'kết hợp [%s] [%s]'],
        ['(letter (%s) of [%s])', 'ký tự thứ (%s) trong [%s]'],
        ['(length of [%s])', 'độ dài của [%s]'],
        ['<[%s] contains [%s]?>', '<[%s] có chứa [%s] ?>'],
        ['(() mod ())', '(() chia lấy dư ())'],
        ['(round ())', 'làm tròn ()'],
        ['([%s v] of (%s))', '([%s v] của (%s))'],
        // Variables
        ['set [%s v] to [%s]', 'đặt [%s v] thành [%s]'],
        ['change [%s v] by (%s)', 'thay đổi [%s v] một lượng (%s)'],
        ['show variable [%s v]', 'hiện biến [%s v]'],
        ['hide variable [%s v]', 'ẩn biến [%s v]']
    ];
    
    function createRegex(template) {
        const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regexStr = escaped.replace(/%s/g, '(.*)');
        return new RegExp(`^${regexStr}$`);
    }

    const translator = translationMap.map(([en, vi]) => ({
        en_re: createRegex(en), vi_re: createRegex(vi), en_tpl: en, vi_tpl: vi
    }));

    function translatePart(text, targetLang) {
        const trimmedText = text.trim();
        if (!trimmedText) return text;
        
        const sourceLang = targetLang === 'vi' ? 'en' : 'vi';

        for (const rule of translator) {
            const sourceRegex = sourceLang === 'en' ? rule.en_re : rule.vi_re;
            const match = trimmedText.match(sourceRegex);

            if (match) {
                let targetTemplate = targetLang === 'vi' ? rule.vi_tpl : rule.en_tpl;
                const params = match.slice(1);
                const translatedParams = params.map(p => translatePart(p, targetLang));
                
                let i = 0;
                return targetTemplate.replace(/%s/g, () => translatedParams[i++]);
            }
        }
        return text; // Base case
    }

    function translateCode(sourceCode, targetLang) {
        if (!sourceCode) return "";
        return sourceCode.split('\n').map(line => translatePart(line, targetLang)).join('\n');
    }

    // =========================================================================================
    // LOGIC ỨNG DỤNG (KHÔNG THAY ĐỔI NHIỀU)
    // =========================================================================================

    var editor = document.getElementById('editor');
    var preview = document.getElementById('preview');
    let standardCode = "when green flag clicked\nforever\nglide (1) secs to x: (pick random (-240) to (240)) y: (pick random (-180) to (180))\nsay [Hello!] for (2) seconds\nnext costume\nend";
    var obj = { script: "", lang: "vi", style: "scratch3" };

    editor.addEventListener('input', function(e) {
        const currentLang = chooseLang.value || 'en';
        standardCode = (currentLang === 'vi') ? translateCode(editor.value, 'en') : editor.value;
        obj.script = editor.value;
        objUpdated();
    });

    var chooseLang = document.getElementById('choose-lang');
    var viOption = document.createElement("option");
    viOption.value = "vi";
    viOption.textContent = "Tiếng Việt";
    chooseLang.appendChild(viOption);

    chooseLang.addEventListener('change', function(e) {
        const targetLang = e.target.value || 'en';
        obj.lang = e.target.value;
        editor.value = translateCode(standardCode, targetLang);
        obj.script = editor.value;
        objUpdated();
    });

    var chooseStyle = document.getElementById('choose-style');
    chooseStyle.addEventListener('change', function(e) {
        obj.style = e.target.value;
        objUpdated();
    });

    function objUpdated() {
        var doc = scratchblocks.parse(obj.script || "", { languages: obj.lang ? ['en', obj.lang] : ['en'] });
        preview.innerHTML = "";
        var view = scratchblocks.newView(doc, { style: obj.style });
        var svg = view.render();
        preview.appendChild(svg);
    }

    const aiPrompt = document.getElementById('ai-prompt');
    const aiGenerateBtn = document.getElementById('ai-generate-btn');
    const aiStatus = document.getElementById('ai-status');
    const aiUploadBtn = document.getElementById('ai-upload-btn');
    const aiImageInput = document.getElementById('ai-image-input');
    const aiImagePreview = document.getElementById('ai-image-preview');
    const removeImageBtn = document.getElementById('remove-image-btn');
    let uploadedImageBase64 = null;

    aiGenerateBtn.addEventListener('click', async () => {
        const userPrompt = aiPrompt.value;
        if (!userPrompt && !uploadedImageBase64) { alert('Vui lòng nhập mô tả hoặc tải ảnh lên cho AI.'); return; }

        aiStatus.textContent = 'AI đang xử lý...';
        aiGenerateBtn.disabled = true;
        aiPrompt.disabled = true;

        try {
            // Thay đổi: Gọi đến API trên backend của bạn thay vì Google API trực tiếp
            const API_URL = '/api/generate'; 

            const requestBody = {
                prompt: userPrompt,
                image: uploadedImageBase64,
            };
            if (uploadedImageBase64) {
                requestBody.imageMimeType = "image/jpeg"; // Giả sử là jpeg
            }
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text(); // Đọc lỗi dưới dạng text để tránh lỗi parse JSON
                throw new Error(`API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json(); // Bây giờ việc này sẽ an toàn hơn
            // Thay đổi: Lấy code từ phản hồi của backend
            const rawResponse = data.code;

            // Cải tiến: Trích xuất chính xác khối mã scratch từ phản hồi của AI
            const match = rawResponse.match(/```(?:scratch\s*)?\n([\s\S]*?)\n```/);
            let generatedCode = rawResponse.trim(); // Giá trị mặc định nếu không tìm thấy khối mã
            if (match && match) {
                generatedCode = match.trim();
            }

            const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(generatedCode);
            standardCode = isVietnamese ? translateCode(generatedCode, 'en') : generatedCode;
            
            const currentLang = chooseLang.value || 'en';
            editor.value = translateCode(standardCode, currentLang);
            obj.script = editor.value;
            objUpdated();

            aiStatus.textContent = 'Đã tạo mã thành công!';
        } catch (error) {
            console.error('Lỗi khi gọi API của AI:', error);
            aiStatus.textContent = `Đã xảy ra lỗi: ${error.message}`;
        } finally {
            aiGenerateBtn.disabled = false;
            aiPrompt.disabled = false;
        }
    });

    aiUploadBtn.addEventListener('click', () => aiImageInput.click());

    aiImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImageBase64 = e.target.result.split(',')[1]; // Lấy phần base64
                aiImagePreview.src = e.target.result;
                aiImagePreview.style.display = 'block';
                removeImageBtn.style.display = 'inline-block';
            };
            reader.readAsDataURL(file);
        }
    });

    removeImageBtn.addEventListener('click', () => {
        uploadedImageBase64 = null;
        aiImagePreview.src = '';
        aiImagePreview.style.display = 'none';
        removeImageBtn.style.display = 'none';
        aiImageInput.value = ''; // Reset input để có thể tải lại cùng 1 file
    });


    function inlineSVGSyles(svg) {
        const style = document.createElement('style');
        let styleText = '';

        // scratchblocks appends its styles to the <head>
        // We need to find them and inline them into the SVG
        const sheets = document.styleSheets;
        for (let i = 0; i < sheets.length; i++) {
            if (sheets[i].href && sheets[i].href.includes('scratchblocks')) continue; // Bỏ qua file ngoài
            try {
                const rules = sheets[i].cssRules;
                for (let j = 0; j < rules.length; j++) {
                    if (rules[j].cssText.includes('.sb3-')) {
                        styleText += rules[j].cssText + '\n';
                    }
                }
            } catch (e) {
                console.warn("Không thể đọc rules từ stylesheet: ", e);
            }
        }

        style.textContent = styleText;
        svg.insertBefore(style, svg.firstChild);
    }

    function triggerDownload(name, dataURL) {
        var a = document.createElement('a');
        a.href = dataURL;
        a.download = name;
        a.click();
    }

    document.getElementById('export-svg').addEventListener('click', function() {
        var svg = preview.querySelector('svg');
        if (!svg) return;
        const svgClone = svg.cloneNode(true);
        inlineSVGSyles(svgClone);
        var svgData = new XMLSerializer().serializeToString(svgClone);
        var dataURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
        triggerDownload('scratchblocks.svg', dataURL);
    });

    document.getElementById('export-png').addEventListener('click', function() {
        var svg = preview.querySelector('svg');
        if (!svg) return;

        const svgClone = svg.cloneNode(true);
        inlineSVGSyles(svgClone);
        var svgData = new XMLSerializer().serializeToString(svgClone);
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        var img = new Image();
        img.onload = function() {
            const scale = 3;
            // Đặt kích thước canvas lớn gấp 3 lần để tăng độ phân giải
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            // Phóng to context để vẽ ảnh lớn hơn
            ctx.scale(scale, scale);

            // Vẽ ảnh lên canvas
            ctx.drawImage(img, 0, 0);
            // Get data URL and trigger download
            var dataURL = canvas.toDataURL('image/png');
            triggerDownload('scratchblocks.png', dataURL);
        };

        // Create a data URL for the SVG
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    });

    document.getElementById('export-sb3').addEventListener('click', function() {
        const currentLang = chooseLang.value || 'en';
        // Luôn chuyển đổi về tiếng Anh trước khi biên dịch
        const englishCode = (currentLang === 'vi') ? translateCode(editor.value, 'en') : editor.value;
        exportToSb3(englishCode);
    });

    function initialize() {
        chooseLang.value = "vi";
        obj.lang = "vi";
        editor.value = translateCode(standardCode, "vi");
        obj.script = editor.value;
        objUpdated();
    }

    initialize();
});