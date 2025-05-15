document.addEventListener('DOMContentLoaded', function() {
    // 导航抽屉功能
    const menuButton = document.getElementById('menuButton');
    const navDrawer = document.getElementById('navDrawer');
    const closeDrawerButton = document.getElementById('closeDrawerButton');
    
    menuButton.addEventListener('click', function() {
        navDrawer.classList.add('open');
    });
    
    closeDrawerButton.addEventListener('click', function() {
        navDrawer.classList.remove('open');
    });
    
    // 页面切换功能
    const navItems = document.querySelectorAll('.nav-drawer ul li');
    const pages = document.querySelectorAll('.page-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            
            // 隐藏所有页面
            pages.forEach(page => page.classList.remove('active'));
            
            // 显示选中的页面
            document.getElementById(pageId).classList.add('active');
            
            // 关闭抽屉
            navDrawer.classList.remove('open');
        });
    });
    
    // 深色模式切换
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    darkModeToggle.addEventListener('click', function() {
        body.setAttribute('data-theme', body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        darkModeToggle.textContent = body.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
        
        // 保存用户偏好
        localStorage.setItem('theme', body.getAttribute('data-theme'));
    });
    
    // 检查是否有保存的主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        darkModeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // 信用卡翻转功能
    const flipCardButton = document.getElementById('flipCardButton');
    const cardContainer = document.querySelector('.credit-card-container');
    
    if (flipCardButton) {
        flipCardButton.addEventListener('click', function() {
            cardContainer.classList.toggle('flipped');
            flipCardButton.textContent = cardContainer.classList.contains('flipped') ? 'Show Front' : 'Flip Card';
        });
    }
    
    // 复制按钮功能
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const textToCopy = document.getElementById(targetId).textContent;
            
            // 创建临时文本区域用于复制
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            // 显示复制状态
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            this.classList.add('copied');
            
            // 2秒后恢复原始状态
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('copied');
            }, 2000);
        });
    });
    
    // 保存卡片图像功能
    const saveCardButton = document.getElementById('saveCardButton');
    if (saveCardButton) {
        saveCardButton.addEventListener('click', function() {
            // 判断是否要保存正面或背面
            const isFlipped = cardContainer.classList.contains('flipped');
            const element = isFlipped ? document.getElementById('cardBack') : document.getElementById('cardFront');
            
            // 使用html2canvas库转换为图像
            html2canvas(element, {
                backgroundColor: null,
                scale: 2, // 提高分辨率
                logging: false,
                allowTaint: true,
                useCORS: true
            }).then(canvas => {
                // 转换为图像并下载
                const image = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.setAttribute('download', `credit-card-${isFlipped ? 'back' : 'front'}.png`);
                a.setAttribute('href', image);
                a.click();
                
                // 显示提示信息
                showToast('Card image saved successfully!');
            });
        });
    }
    
    // 创建提示信息显示功能
    function showToast(message) {
        // 检查是否已存在toast
        let toast = document.querySelector('.toast-message');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-message';
            document.body.appendChild(toast);
        }
        
        // 设置消息并显示
        toast.textContent = message;
        toast.classList.add('show');
        
        // 3秒后隐藏
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // 卡片颜色自定义
    const cardColorInput = document.getElementById('cardColor');
    const cardFront = document.getElementById('cardFront');
    const cardBack = document.getElementById('cardBack');
    
    if (cardColorInput) {
        cardColorInput.addEventListener('input', function() {
            document.documentElement.style.setProperty('--card-color', this.value);
        });
    }
    
    // 生成卡片信息功能
    const generateButton = document.getElementById('generateButton');
    const resultCard = document.getElementById('resultCard');
    
    if (generateButton) {
        generateButton.addEventListener('click', generateCreditCard);
    }
    
    function generateCreditCard() {
        const countrySelect = document.getElementById('countrySelect');
        const cardIssuer = document.getElementById('cardIssuer');
        
        const country = countrySelect.value;
        const issuer = cardIssuer.value;
        
        // 生成信用卡信息
        const cardInfo = {
            cardNumber: generateCardNumber(issuer),
            cvv: generateCVV(issuer),
            expiryDate: generateExpiryDate(),
            holderName: generateName(country),
            address: generateAddress(country),
            city: generateCity(country),
            postalCode: generatePostalCode(country),
            country: countrySelect.options[countrySelect.selectedIndex].text
        };
        
        // 显示生成的信息
        displayCardInfo(cardInfo, issuer);
        
        // 显示结果卡片
        resultCard.style.display = 'block';
        
        // 重置卡片翻转状态
        document.querySelector('.credit-card-container').classList.remove('flipped');
        document.getElementById('flipCardButton').textContent = 'Flip Card';
    }
    
    function generateCardNumber(issuer) {
        let prefix, length;
        
        switch(issuer) {
            case 'visa':
                prefix = '4';
                length = 16;
                break;
            case 'mastercard':
                prefix = '5' + Math.floor(Math.random() * 5 + 1);
                length = 16;
                break;
            case 'amex':
                prefix = '3' + (Math.random() > 0.5 ? '4' : '7');
                length = 15;
                break;
            case 'discover':
                prefix = '6011';
                length = 16;
                break;
            case 'jcb':
                prefix = '35';
                length = 16;
                break;
            default:
                prefix = '4';
                length = 16;
        }
        
        let number = prefix;
        for (let i = prefix.length; i < length - 1; i++) {
            number += Math.floor(Math.random() * 10);
        }
        
        // 计算并添加校验位，使用Luhn算法
        number += calculateLuhnCheckDigit(number);
        
        return number;
    }
    
    function calculateLuhnCheckDigit(partialNumber) {
        let sum = 0;
        let shouldDouble = false;
        
        for (let i = partialNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(partialNumber.charAt(i));
            
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return ((Math.floor(sum / 10) + 1) * 10 - sum) % 10;
    }
    
    function generateCVV(issuer) {
        const length = issuer === 'amex' ? 4 : 3;
        let cvv = '';
        for (let i = 0; i < length; i++) {
            cvv += Math.floor(Math.random() * 10);
        }
        return cvv;
    }
    
    function generateExpiryDate() {
        const currentYear = new Date().getFullYear();
        const year = currentYear + Math.floor(Math.random() * 5) + 1; // 1-5年后到期
        const month = Math.floor(Math.random() * 12) + 1;
        return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
    }
    
    function generateName(country) {
        const firstNames = {
            us: ['John', 'Michael', 'Robert', 'David', 'James', 'Mary', 'Jennifer', 'Linda', 'Patricia', 'Elizabeth'],
            uk: ['Oliver', 'Jack', 'Harry', 'George', 'William', 'Olivia', 'Emily', 'Amelia', 'Isla', 'Ava'],
            ca: ['Liam', 'Noah', 'Ethan', 'Logan', 'Lucas', 'Olivia', 'Emma', 'Charlotte', 'Sophia', 'Ava'],
            au: ['Oliver', 'William', 'Jack', 'Noah', 'Thomas', 'Charlotte', 'Olivia', 'Ava', 'Emily', 'Mia'],
            de: ['Maximilian', 'Alexander', 'Paul', 'Leon', 'Louis', 'Sophie', 'Maria', 'Emma', 'Hannah', 'Emilia'],
            fr: ['Gabriel', 'Louis', 'Raphael', 'Jules', 'Adam', 'Emma', 'Jade', 'Louise', 'Alice', 'Chloé'],
            jp: ['Haruto', 'Yuto', 'Sota', 'Yuki', 'Ren', 'Aoi', 'Hina', 'Yui', 'Akari', 'Rio'],
            cn: ['Wei', 'Jian', 'Li', 'Ming', 'Hao', 'Xiu', 'Mei', 'Na', 'Ying', 'Fang']
        };
        
        const lastNames = {
            us: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'],
            uk: ['Smith', 'Jones', 'Williams', 'Taylor', 'Brown', 'Davies', 'Evans', 'Wilson', 'Thomas', 'Roberts'],
            ca: ['Smith', 'Brown', 'Tremblay', 'Martin', 'Roy', 'Wilson', 'MacDonald', 'Gagnon', 'Johnson', 'Lee'],
            au: ['Smith', 'Jones', 'Williams', 'Brown', 'Wilson', 'Taylor', 'Johnson', 'White', 'Anderson', 'Thompson'],
            de: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Hoffmann', 'Schulz'],
            fr: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'],
            jp: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato'],
            cn: ['Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhou', 'Wu', 'Zhao']
        };
        
        // 如果没有指定国家的名字，使用美国
        const countryNames = firstNames[country] || firstNames.us;
        const countrySurnames = lastNames[country] || lastNames.us;
        
        const firstName = countryNames[Math.floor(Math.random() * countryNames.length)];
        const lastName = countrySurnames[Math.floor(Math.random() * countrySurnames.length)];
        
        return `${firstName} ${lastName}`;
    }
    
    function generateAddress(country) {
        const streetNames = {
            us: ['Main St', 'Oak Ave', 'Maple St', 'Washington Ave', 'Park Rd'],
            uk: ['High St', 'Station Rd', 'Church St', 'London Rd', 'Victoria Rd'],
            ca: ['King St', 'Queen St', 'Main St', 'Yonge St', 'Bloor St'],
            au: ['George St', 'King St', 'Bridge Rd', 'Church St', 'Collins St'],
            de: ['Hauptstraße', 'Schulstraße', 'Dorfstraße', 'Bergstraße', 'Bahnhofstraße'],
            fr: ['Rue de Paris', 'Rue de l\'Église', 'Rue du Moulin', 'Avenue des Fleurs', 'Rue Principale'],
            jp: ['Sakura-dori', 'Ginza', 'Omotesando', 'Takeshita-dori', 'Chuo-dori'],
            cn: ['Nanjing Lu', 'Huaihai Lu', 'Zhongshan Lu', 'Renmin Lu', 'Jianguo Lu']
        };
        
        // 如果没有指定国家的地址，使用美国
        const streets = streetNames[country] || streetNames.us;
        const streetNumber = Math.floor(Math.random() * 1000) + 1;
        const street = streets[Math.floor(Math.random() * streets.length)];
        
        return `${streetNumber} ${street}`;
    }
    
    function generateCity(country) {
        const cities = {
            us: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
            uk: ['London', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol', 'Manchester', 'Sheffield', 'Leeds', 'Edinburgh', 'Newcastle'],
            ca: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
            au: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Wollongong', 'Hobart'],
            de: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen'],
            fr: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
            jp: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama'],
            cn: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Tianjin', 'Chongqing', 'Nanjing', 'Wuhan', 'Chengdu', 'Xi\'an']
        };
        
        // 如果没有指定国家的城市，使用美国
        const countryCities = cities[country] || cities.us;
        return countryCities[Math.floor(Math.random() * countryCities.length)];
    }
    
    function generatePostalCode(country) {
        switch(country) {
            case 'us':
                return Math.floor(Math.random() * 90000) + 10000; // 5位数字
            case 'uk':
                // 英国邮编格式：AA9A 9AA
                const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const letter1 = letters[Math.floor(Math.random() * 26)];
                const letter2 = letters[Math.floor(Math.random() * 26)];
                const num1 = Math.floor(Math.random() * 10);
                const letter3 = letters[Math.floor(Math.random() * 26)];
                const num2 = Math.floor(Math.random() * 10);
                const letter4 = letters[Math.floor(Math.random() * 26)];
                const letter5 = letters[Math.floor(Math.random() * 26)];
                return `${letter1}${letter2}${num1}${letter3} ${num2}${letter4}${letter5}`;
            case 'ca':
                // 加拿大邮编格式：A9A 9A9
                const caLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const caLetter1 = caLetters[Math.floor(Math.random() * 26)];
                const caNum1 = Math.floor(Math.random() * 10);
                const caLetter2 = caLetters[Math.floor(Math.random() * 26)];
                const caNum2 = Math.floor(Math.random() * 10);
                const caLetter3 = caLetters[Math.floor(Math.random() * 26)];
                const caNum3 = Math.floor(Math.random() * 10);
                return `${caLetter1}${caNum1}${caLetter2} ${caNum2}${caLetter3}${caNum3}`;
            case 'au':
                return Math.floor(Math.random() * 9000) + 1000; // 4位数字
            case 'de':
                return Math.floor(Math.random() * 90000) + 10000; // 5位数字
            case 'fr':
                return Math.floor(Math.random() * 90000) + 10000; // 5位数字
            case 'jp':
                return Math.floor(Math.random() * 900) + 100 + '-' + (Math.floor(Math.random() * 9000) + 1000); // 3位数字-4位数字
            case 'cn':
                return Math.floor(Math.random() * 900000) + 100000; // 6位数字
            default:
                return Math.floor(Math.random() * 90000) + 10000;
        }
    }
    
    function displayCardInfo(cardInfo, issuer) {
        // 显示卡片正面信息
        document.getElementById('displayCardNumber').textContent = formatCardNumber(cardInfo.cardNumber, issuer);
        document.getElementById('displayCardHolder').textContent = cardInfo.holderName;
        document.getElementById('displayExpiry').textContent = cardInfo.expiryDate;
        
        // 显示卡片背面信息
        document.getElementById('displaySignature').textContent = cardInfo.holderName;
        document.getElementById('displayCVV').textContent = cardInfo.cvv;
        
        // 显示卡片详情信息
        document.getElementById('displayName').textContent = cardInfo.holderName;
        document.getElementById('displayAddress').textContent = cardInfo.address;
        document.getElementById('displayCity').textContent = cardInfo.city;
        document.getElementById('displayPostal').textContent = cardInfo.postalCode;
        document.getElementById('displayCountry').textContent = cardInfo.country;
        document.getElementById('displayNumber').textContent = formatCardNumber(cardInfo.cardNumber, issuer);
        document.getElementById('displayDetailCVV').textContent = cardInfo.cvv;
        document.getElementById('displayDetailExpiry').textContent = cardInfo.expiryDate;
        document.getElementById('displayIssuer').textContent = formatIssuerName(issuer);
        
        // 更新卡片发行商图标
        updateCardIssuerLogo(issuer);
    }
    
    function formatCardNumber(number, issuer) {
        if (issuer === 'amex') {
            return `${number.substring(0, 4)} ${number.substring(4, 10)} ${number.substring(10)}`;
        } else {
            return `${number.substring(0, 4)} ${number.substring(4, 8)} ${number.substring(8, 12)} ${number.substring(12)}`;
        }
    }
    
    function formatIssuerName(issuer) {
        const issuerNames = {
            visa: 'Visa',
            mastercard: 'MasterCard',
            amex: 'American Express',
            discover: 'Discover',
            jcb: 'JCB'
        };
        
        return issuerNames[issuer] || issuer;
    }
    
    function updateCardIssuerLogo(issuer) {
        // 这里可以根据不同的发行商设置不同的logo背景
        const cardIssuerLogo = document.getElementById('cardIssuerLogo');
        const cardIssuerLogoBack = document.getElementById('cardIssuerLogoBack');
        
        // 清除之前的类
        cardIssuerLogo.className = 'card-issuer';
        cardIssuerLogoBack.className = 'card-issuer-back';
        
        // 添加对应的类
        cardIssuerLogo.classList.add(`${issuer}-logo`);
        cardIssuerLogoBack.classList.add(`${issuer}-logo`);
        
        // 基于发行商添加文本
        switch(issuer) {
            case 'visa':
                cardIssuerLogo.textContent = 'VISA';
                cardIssuerLogoBack.textContent = 'VISA';
                break;
            case 'mastercard':
                cardIssuerLogo.textContent = 'MasterCard';
                cardIssuerLogoBack.textContent = 'MC';
                break;
            case 'amex':
                cardIssuerLogo.textContent = 'AMEX';
                cardIssuerLogoBack.textContent = 'AMEX';
                break;
            case 'discover':
                cardIssuerLogo.textContent = 'DISCOVER';
                cardIssuerLogoBack.textContent = 'DISC';
                break;
            case 'jcb':
                cardIssuerLogo.textContent = 'JCB';
                cardIssuerLogoBack.textContent = 'JCB';
                break;
            default:
                cardIssuerLogo.textContent = '';
                cardIssuerLogoBack.textContent = '';
        }
    }
}); 