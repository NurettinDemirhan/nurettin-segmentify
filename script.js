
let step = 0; 

let productSelector = {
    "category" : "",
    "color" : "",
    "price" : ""
}


fetch("questions.json")
.then(function(response){
    return response.json();
})
.then(function(questions){
    let placeholder = document.querySelector("#data-output");
    let out = "";

    function renderStep(step) {
        if (step == 0) {
           
            out = `
            
                <div class="output-inner">
               
                    <h2 class="step-header">${questions[0].steps[0].title}</h2>
        
                    <div class="toggle">
                        <input type="radio" name="category" value="weight" id="${questions[0].name}"  />
                        <label for="${questions[0].name}">${questions[0].name}</label>
        
                        <input type="radio" name="category" value="${questions[1].name}" id="${questions[1].name}" />
                        <label for="${questions[1].name}">${questions[1].name}</label>
        
                        <input type="radio" name="category" value="c" id="${questions[2].name}" />
                        <label for="${questions[2].name}">${questions[2].name}</label>
                    </div>

                    <div class="step-count-section">
                        <div class="step-count" style="background-color: rgb(0, 0, 0);"></div>
                        <div class="step-count"></div>
                        <div class="step-count"></div>
                    </div>

                    <div class="btnSection">
                        <button class="backBtn" id="backBtnCategory" disabled>Back</button>
                        <button class="nextBtn" id="nextBtnCategory" disabled>Next</button>
                    </div>

                    </div>`;
            
        } else if (step == 1) {
            //hangi kategoride olduğuma göre text ayarlama
            const filteredQuestionTest = questions.filter(question => question.name == productSelector.category);
            const filteredQuestion = filteredQuestionTest[0]
    
            //her kategorinin colorları farklı olduğu için text ayarı
            let colorOut = ``;
            for(let color of filteredQuestion.steps[step].answers){
                colorOut+= `
                <input class="color-input" style="background-color:var(--${color.toLowerCase()}) !important" type="radio" name="color" value="${color}" id="${color}" />
                <label class="color-label" style="background-color:var(--${color.toLowerCase()}) !important" for="${color}"><p>&#10003</p></label>`
            }

            out = `
                <div class="output-inner"> 
                    <h2 class="step-sub-header">${filteredQuestion.steps[step].subtitle}</h2>
                    <h2 class="step-header">${filteredQuestion.steps[step].title}</h2>
                
                <div class=toggle>
                    ${colorOut}
                </div>

                <div class="step-count-section">
                        <div class="step-count" style="background-color: rgb(0, 0, 0);"></div>
                        <div class="step-count" style="background-color: rgb(0, 0, 0);"></div>
                        <div class="step-count"></div>
                </div>

                <div class="btnSection">
                    <button class="backBtn" id="backBtnColor">Back</button>
                    <button class="nextBtn" id="nextBtnColor" disabled >Next</button>
                </div>

                </div>
                `;
        }else if(step == 2){
            const filteredQuestionTest = questions.filter(question => question.name == productSelector.category);
            const filteredQuestion = filteredQuestionTest[0]

            let priceOut = ``;
            for(let price of filteredQuestion.steps[step].answers){
                priceOut+= `
                <input class="price-input" type="radio" name="price" value="${price}" id="${price}" />
                <label class="price-input" for="${price}">€${price}</label>`
            }

            out = `
            

                <div class="output-inner"> 

                    <h2 class="step-sub-header">${filteredQuestion.steps[step].subtitle}</h2>
                    <h2 class="step-header">${filteredQuestion.steps[step].title}</h2>

                    <div class=toggle>
                        ${priceOut}
                    </div>

                    <div class="step-count-section">
                        <div class="step-count" style="background-color: rgb(0, 0, 0);"></div>
                        <div class="step-count" style="background-color: rgb(0, 0, 0);"></div>
                        <div class="step-count" style="background-color: rgb(0, 0, 0);"></div>
                    </div>

                    <div class="btnSection">
                        <button class="backBtn" id="backBtnPrice">Back</button>
                        <button class="nextBtn" id="nextBtnPrice" disabled >Next</button>
                    </div>
                </div>
                `;
        }else if(step == 3){
            fetch("products.json")
            .then(function(response){
                return response.json();
            })
            .then(function(products){
                // ürünleri filtreleyerek uygun olanları saklıyorum

                let filteredProductsSlider = products.filter(function(product) {
                
                    if (productSelector.category !== "" && !product.category[0].includes(productSelector.category)) {
                        return false;
                    }
                
                    if (productSelector.color !== "" && !product.colors.some(color => color.toLowerCase() === productSelector.color.toLowerCase())) {
                        return false;
                    }

                    if (productSelector.price !== "") {
                        let priceRange = productSelector.price.split("-");
                        
                        
                        if (priceRange[1] == undefined){
                            priceRange[0] = priceRange[0].replace("+", "");
                            priceRange[1] = "1000";
                        };
                        const minPrice = parseFloat(priceRange[0]);
                        const maxPrice = parseFloat(priceRange[1]);
                        
                        if (product.price < minPrice || product.price > maxPrice) {
                            return false;
                        }
                    }
                    //matching products
                    return true;
                });

                //uygun olan productlarla slider hazırlama

                console.log(filteredProductsSlider);
                let productsOut = ``;
                let oldPriceOut = ``;
                let colorBlack = ``;
                for(let item of filteredProductsSlider){
                    if(item.oldPrice){
                        oldPriceOut = `<p class="old-price" >€${item.oldPrice}</p>`
                        colorBlack = "red"
                    }else{
                        oldPriceOut = ``
                        colorBlack = "black"
                        console.log(oldPriceOut)
                    }
                    productsOut+= `
                    <div class="swiper-slide">
                        <img src=${item.image} loading="lazy"/>
                        <h3>${item.name}</h3>
                        ${oldPriceOut}
                        <p style="color:var(--${colorBlack.toLowerCase()}) !important">€${item.price}</p>
                        <a  href="${item.url}"
                            target="_blank"
                            class="product-url">

                        View Product
                        </a>
                    </div>
                    `
                }
                if(productsOut == ``){
                    out =  `<div class="output-inner">
                                <div class="item-not-found">
                                    <h3 >Product not found</h3>
                                </div>

                                
                                <div class="btnSection">
                                    <button class="backBtn" id="backBtnProduct">Back</button>
                                </div>
                                
                            </div>
                            `
                }else{
                    out =  `<div class="output-inner">

                                <div class="swiper" id="swiper-output">
                                    <div class="swiper-wrapper">
                                        <!-- Slides -->
                                        ${productsOut}
                                        ...
                                    </div>
                                    
                                    <div class="swiper-button-prev"></div>
                                    <div class="swiper-button-next"></div>
                                    
                                    
                                    <div class="swiper-scrollbar"></div>
                                    
                                        
                                </div>
                                <div class="btnSection">
                                    <button class="backBtn" id="backBtnProduct">Back</button>
                                </div>
                                
                            </div>
                            `
                }
                placeholder.innerHTML = out;

                //swiper kütüphanesi çalışması için gerekli kod
                const swiper = new Swiper('.swiper', {
                    
                    loop: true,
                    
                    pagination: {
                        el: '.swiper-pagination',
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    scrollbar: {
                        el: '.swiper-scrollbar',
                    },
                });
            

                document.querySelectorAll('#backBtnProduct').forEach(function(btn) {
                    btn.addEventListener("click", function() {
                        productSelector.price = "";
                        console.log(productSelector)
                        step--;
                        renderStep(step);
                    });
                });


            });
            
        }
        placeholder.innerHTML = out;

        //step 0 buton ayarları 
        document.querySelectorAll('#nextBtnCategory').forEach(function(btn) {
            btn.addEventListener("click", function() {
                    const selectedInput = document.querySelector('input[type="radio"][name="category"]:checked');
                    productSelector.category = selectedInput.id;
                    step++;
                    console.log(productSelector);
                    renderStep(step);
            });
        });

        document.querySelectorAll('input[type="radio"][name="category"]').forEach(function(radio) {
            radio.addEventListener("change", function() {
                const nextBtnCategory = document.getElementById("nextBtnCategory");
                nextBtnCategory.disabled = !document.querySelector('input[type="radio"][name="category"]:checked');
            });
        });
        
        //step 1 buton ayarları
        document.querySelectorAll('#nextBtnColor').forEach(function(btn) {
            btn.addEventListener("click", function() {
                    const selectedInput = document.querySelector('input[type="radio"][name="color"]:checked');
                    productSelector.color = selectedInput.id;
                    step++;
                    console.log(productSelector)
                    renderStep(step);
            });
        });
        document.querySelectorAll('#backBtnColor').forEach(function(btn) {
            btn.addEventListener("click", function() {
                productSelector.category = "";
                console.log(productSelector)
                step--;
                renderStep(step);
            });
        });


        document.querySelectorAll('input[type="radio"][name="color"]').forEach(function(radio) {
            radio.addEventListener("change", function() {
                const nextBtnColor = document.getElementById("nextBtnColor");
                nextBtnColor.disabled = !document.querySelector('input[type="radio"][name="color"]:checked');
            });
        });

        //step 2 buton ayarları
        document.querySelectorAll('#nextBtnPrice').forEach(function(btn) {
            btn.addEventListener("click", function() {
                    const selectedInput = document.querySelector('input[type="radio"][name="price"]:checked');
                    productSelector.price = selectedInput.id;
                    step++;
                    console.log(productSelector)
                    renderStep(step);
            });
        });
        document.querySelectorAll('#backBtnPrice').forEach(function(btn) {
            btn.addEventListener("click", function() {
                productSelector.color = "";
                console.log(productSelector)
                step--;
                renderStep(step);
            });
        });

        document.querySelectorAll('input[type="radio"][name="price"]').forEach(function(radio) {
            radio.addEventListener("change", function() {
                const nextBtnPrice = document.getElementById("nextBtnPrice");
                nextBtnPrice.disabled = !document.querySelector('input[type="radio"][name="price"]:checked');
            });
        });

    }

    renderStep(step);
})
.catch(function(error) {
    console.error('Error fetching data:', error);
});

