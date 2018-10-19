import { FileLoader } from '@tspower/fileloader';
import {htmlParse, log, setLocal, getLocal, removeLocal }from '@tspower/core';
import { Subject } from 'rxjs';
import * as stili from './imageloader.styl';
import { spinner } from '@tspower/spinner';
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
    public FileName = null;
    constructor(

        private Root:HTMLElement,
        private Id?:string,
        private InputName?:string,
        private Src?:string,
        private Autosave?:boolean,
        private Url?:string,
        
        private Style?:string,
        private ButtonStyle?:string,
        private ImageStyle?:string,
        private DisplayUploadButton:boolean = false,

    ){
        this.spinnerTemplate = new spinner("sfere").template;

        this.tag = this.create();
        this.spinner = this.tag.querySelector("div[spinner]");
        this.image = this.tag.querySelector("img");
        this.btn_load = this.tag.querySelector("button[upload]");
        this.btn_erase = this.tag.querySelector("button[erase]");
        this.fileLoader = new FileLoader(this.tag, false);
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
            this.FileName = selectedFile.name;
            let status = null;
            reader.onload = function(event:any) {
              that.image.src = event.target.result;

                if(that.Autosave){
                    status = {
                        id: that.Id,
                        name: that.InputName,
                        fileName: that.FileName,
                        src : event.target.result
                    };
                    setLocal(`imageloader_${that.Id}_${that.InputName}`, status);
                }

            };

            reader.readAsDataURL(selectedFile);

            this.enableButton(this.btn_erase);
            this.enableButton(this.btn_load);


            
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
                this.disableButton(this.btn_erase);
                this.disableButton(this.btn_load);

            }).catch(()=>{
                
                this.spinner.style.display = 'none';
                this.disableButton(this.btn_load);

            });
        });

        this.btn_erase.addEventListener("click", (event)=>{

            this.image.src = (this.Src)?this.Src:"";
            this.image.title = (this.Src)?"placeholder":"";
            if(this.Autosave){
                removeLocal(`imageloader_${this.Id}_${this.InputName}`);
            }

        });
        if(!this.DisplayUploadButton){
            this.btn_load.style.display = "none";
        }

        if(this.Autosave){
            let that = this;
            let status = getLocal(`imageloader_${this.Id}_${this.InputName}`);
            if(status){
                
                var reader = new FileReader();
                this.image.title = status.fileName;
                this.FileName = status.name;
                this.image.src = status.src;
                this.enableButton(this.btn_erase);
            }
        }

    }
    private create = ():HTMLElement=>{

        let stile = (this.Style)?`style="${this.Style}"`:null;
        let imgStile = (this.ImageStyle)?`style="${this.ImageStyle}"`:null;
        let ButtonStyle = (this.ButtonStyle)?`style="${this.ButtonStyle}`:null;
        let Id = (this.Id)?`id=${this.Id}`:null;
        let src = (this.Src)?`src=${this.Src}`:null;
        let template = `<div ${(Id)?Id:""}  ${(stile)?stile:""} class="ts-imageloader" >
                            <div spinner >${this.spinnerTemplate}</div>
                            <img ${(src)?src:""}  ${(imgStile)?imgStile:""} />
                            <button upload ${(ButtonStyle)?ButtonStyle:""} disabled > Upload </button>
                            <button erase disabled >Erase</button>
                        </div>`;
        let t = htmlParse(template);

        return t;
    }

    private enableButton = (button:HTMLButtonElement):void =>{
        button.removeAttribute("disabled");
    }
    private disableButton = (button:HTMLButtonElement):void =>{
        button.setAttribute("disabled", '');
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
        this.image.src = (this.Src)?this.Src:"";
        this.image.title = (this.Src)?"placeholder":"";
        this.disableButton(this.btn_erase);
    }

    setAutosave = (autosave:boolean)=>this.Autosave = autosave;


}
