import { FileLoader } from '@tspower/fileloader';
import {htmlParse, log} from '@tspower/core';
import { Subject } from 'rxjs';
import * as stili from './imageloader.styl';
import { spinner } from '../../@tspower_spinner/lib/spinner';
stili.default


export class ImageLoader{

    private fileLoader:FileLoader;
    private tag:HTMLElement;
    private image:HTMLImageElement;
    private btn_load:HTMLButtonElement;
    private btn_erase:HTMLButtonElement;
    private uploaded =  new Subject<Promise<any>>();
    private spinnerTemplate:string;
    private spinner:HTMLElement;


    public uploaded$ = this.uploaded.asObservable();

    constructor(

        private Root:HTMLElement,
        private DisplayUploadButton:boolean = false,
        private Url?:string,
        private InputName?:string,
        private Style?:string,
        private ButtonStyle?:string,
        private ImageStyle?:string

    ){
        this.spinnerTemplate = new spinner("sfere").template;

        this.tag = this.create();
        this.spinner = this.tag.querySelector("div[spinner]");
        this.image = this.tag.querySelector("img");
        this.btn_load = this.tag.querySelector("button[upload]");
        this.btn_erase = this.tag.querySelector("button[erase]");
        this.fileLoader = new FileLoader(this.tag, false, null, null, "display:block;width:72px;height:24px;");
        this.Root.appendChild(this.tag);
        this.Init();
        
    }
    
    private Init = ()=>{
        this.spinner.style.display = "none";
        this.fileLoader.changed$.subscribe(val=>{
            let that = this;
            var selectedFile = val[0];
            var reader = new FileReader();
            this.image.title = selectedFile.name;

            reader.onload = function(event:any) {
              that.image.src = event.target.result;
            };

            reader.readAsDataURL(selectedFile);
            this.btn_load.classList.remove("disabled");
            this.btn_erase.classList.remove("disabled");
        });

        this.btn_load.addEventListener("click", async(event)=>{

                if(this.DisplayUploadButton == true && this.Url!=null && this.InputName!=null){
                    this.spinner.style.display = 'block';
                    this.uploaded.next(this.fileLoader.send(this.Url, this.InputName));
                }

        });

        this.uploaded$.subscribe(promise=>{
            promise.then(()=>{

                this.spinner.style.display = 'none';
                this.btn_erase.classList.add("disabled");
                this.btn_load.classList.add("disabled");

            }).catch(()=>{
                
                this.spinner.style.display = 'none';
                this.btn_load.classList.add("disabled");

            });
        });

        this.btn_erase.addEventListener("click", (event)=>{

            this.image.src = "";
            this.image.title = "";

        });

    }
    private create = ():HTMLElement=>{

        let stile = (this.Style)?`style="${this.Style}"`:null;
        let imgStile = (this.ImageStyle)?`style="${this.ImageStyle}"`:null;
        let ButtonStyle = (this.ButtonStyle)?`style="${this.ButtonStyle}`:null;
        

        let template = `<div ${(stile)?stile:""} class="ts-imageloader" >
                            <div spinner >${this.spinnerTemplate}</div>
                            <img src=""  ${(imgStile)?imgStile:""} />
                            <button upload ${(ButtonStyle)?ButtonStyle:""} class="disabled" > Upload </button>
                            <button erase class="disabled" >Erase</button>
                        </div>`;
        let t = htmlParse(template);
        return t;
    }

    setUploadUrl = (value:string)=>{
        this.Url = value;
    }

    setInputName = (value:string)=>{
        this.InputName = value;
    }

    upload = () =>{
        if(this.Url!=null && this.InputName!=null)
            this.uploaded.next(this.fileLoader.send(this.Url, this.InputName));
    }

    erase = ()=>{
        this.image.src = "";
        this.image.title = "";
    }


}
