//const fetch     = require('node-fetch');
const cheerio   = require('cheerio');
const store     = require('electron-storage');

const CheerioScraping = {
    tagType     : null,
    site_url    : null,
    domain      : null,
    $_CHEERIO   : null,
    destiny     : null,
    pages_info  : [],

    allInternalLinks : [],
    
    async getImage() {

        let html = await this.getHtml();
        this.destiny = document.querySelector('#myTabContent .list-images');
        this.$_CHEERIO = cheerio.load(html);


        this.$_CHEERIO('img').each( (index, el) => {
            var liItem  = document.createElement('LI');
            var image   = document.createElement('img');
            var imageAlt= document.createElement('p');

            liItem.classList.add("col-4", "px-2");

            image.setAttribute('src', this.$_CHEERIO(el).attr('src'));
            image.setAttribute('alt', this.$_CHEERIO(el).attr('alt'));

            imageAlt.textContent = this.$_CHEERIO(el).attr('alt');

            liItem.appendChild(image);
            liItem.appendChild(imageAlt);

            this.destiny.appendChild(liItem);
        });


        console.log('Todas as imagens foram listadas...');
    },

    async getMainTitle() {

        let html = await this.getHtml();
        this.destiny = document.querySelector('#myTabContent .list-main-title');
        this.$_CHEERIO = cheerio.load(html);


        this.$_CHEERIO('h1').each( (index, el) => {
            var liItem  = document.createElement('LI');
            var title   = document.createElement('h1');
            
            if(this.$_CHEERIO(el).text() == "") {
                title.textContent = 'No text informaed';
            } else {
                title.textContent = this.$_CHEERIO(el).text().replace(/\s+/g," ");
            }


            liItem.appendChild(title);
            
            this.destiny.appendChild(liItem);
        });


        console.log('Todos os H1 foram listados...');
    },

    async getAllLinks() {

        let html = await this.getHtml();
        this.destiny = document.querySelector('#myTabContent .list-links');
        this.$_CHEERIO = cheerio.load(html);


        this.$_CHEERIO('a').each( (index, el) => {
            var liItem  = document.createElement('LI');
            var title   = document.createElement('p');
            var link    = document.createElement('p');
            
            title.textContent = 'Text: ' + this.$_CHEERIO(el).text().replace(/\s+/g," ");
            link.textContent = 'link: ' + this.$_CHEERIO(el).attr('href');
        
            liItem.appendChild(title);
            liItem.appendChild(link);
            
            this.destiny.appendChild(liItem);
        });


        console.log('Todos os LINKS foram listados...');
    },

    execScraping() {

        switch (this.tagType) {
            case 'img':
                this.getImage();
                
                break;
        
            default:
                this.getMainTitle();
                this.getImage();
                this.getAllLinks();

                break;
        }
    },

    async getAllInternalLinks() {
        this.allInternalLinks.push(this.site_url);
        var aux = 0;
        let n_link = document.querySelector('.number-links p');
        
        console.log('início do loop');
        
        for (let internal_link of this.allInternalLinks) {
            let html = await this.getHtml(internal_link);
            this.$_CHEERIO = cheerio.load(html);

            this.pages_info.push({
                'url'   : internal_link,
                'links' : [],
                'images': [] 
            })

            this.$_CHEERIO('a').each( (i, link) => {
                link = link.attribs.href;
                
                this.pages_info[this.pages_info.length-1].links.push(link);

                if(link !== undefined && link !== '') {

                    if(!this.allInternalLinks.includes(link)) {

                        if(link.includes(this.domain)) {
                            this.allInternalLinks.push(link);                            
                            
                            aux++;
                            //console.log('Link ' + aux + ': ' + link);
                            n_link.textContent = aux;
                        }

                    }
                }
            });

            this.$_CHEERIO('img').each( (i, image) => {
                this.pages_info[this.pages_info.length-1].images.push({
                    'alt': this.$_CHEERIO(image).attr('alt'),
                    'src': this.$_CHEERIO(image).attr('src')
                });
                /*this.writeImageInScreen(
                    this.$_CHEERIO(image).attr('src'),
                    this.$_CHEERIO(image).attr('alt')
                );*/
            });

            this.$_CHEERIO('h1').each( (i, main_title) => {
                let text = this.$_CHEERIO(main_title).text().replace(/\s+/g," ");
                this.writeMainTitle(text);
            })

            document.querySelector('.number-links-loaded p').textContent = parseInt(document.querySelector('.number-links-loaded p').textContent) + 1;
        }
        console.log('Fim do loop');

        store.set(url_info_list, this.pages_info).then(console.log('Storage ended'));
    },

    async getHtml(url = this.site_url) {
        const response = await (url);
        const html = await response.text();

        return html;
    },

    writeImageInScreen(src, alt) {
        this.destiny = document.querySelector('#myTabContent .list-images');

        var liItem  = document.createElement('LI');
        var image   = document.createElement('img');
        var imageAlt= document.createElement('p');

        liItem.classList.add("col-4", "px-2");

        image.setAttribute('src', src);
        image.setAttribute('alt', alt);

        imageAlt.textContent = alt;

        liItem.appendChild(image);
        liItem.appendChild(imageAlt);

        this.destiny.appendChild(liItem);
    },

    writeMainTitle(title) {
        this.destiny = document.querySelector('#myTabContent .list-main-title');
        var liItem      = document.createElement('LI');
        var title_h1    = document.createElement('h1');
        
        if(title == "") {
            title_h1.textContent = 'No text informaed';
        } else {
            title_h1.textContent = title;
        }

        liItem.appendChild(title_h1);
        
        this.destiny.appendChild(liItem);
    }

}

export default CheerioScraping;