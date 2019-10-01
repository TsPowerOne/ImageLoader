import { FileLoader } from '@tspower/fileloader';
import {htmlParse, log, setLocal, getLocal, removeLocal }from '@tspower/core';
import { Subject } from 'rxjs';
import * as stili from './imageloader.styl';
import { Spin_Sphere} from '@tspower/spinner';
stili.default

export class ImageLoaderSetter {
    public Root:HTMLElement = null;
    public Id?:string = null;
    public InputName?:string = null;
    public Src?:string = null;
    public Autosave?:boolean = false;
    public Url?:string = null;
    
    public Style?:string = null;
    public ButtonStyle?:string = null;
    public ImageStyle?:string = null;
    public DisplayUploadButton:boolean = false ;
}
export class ImageLoader{

    private fileLoader:FileLoader;
    private tag:HTMLElement;
    private image:HTMLImageElement;
    private btn_load:HTMLButtonElement;
    private btn_erase:HTMLButtonElement;
    private uploaded =  new Subject<Promise<any>>();
    private erased = new Subject<any>();
    private spinnerTemplate:string;
    private spinner:HTMLElement;
    private Root: HTMLElement;
    private Autosave: boolean = false;

    private Id?:string = null;
    private InputName?:string = null;
    private Src?:string = null;
    private Url?:string = null;
    
    private Style?:string = null;
    private ButtonStyle?:string = null;
    private ImageStyle?:string = null;
    private DisplayUploadButton:boolean = false ;
    private Loader:HTMLElement = null;
    public uploaded$ = this.uploaded.asObservable();
    public erased$ = this.erased.asObservable();

    public FileName = null;
    constructor(setter: ImageLoaderSetter){
        this.Autosave = setter.Autosave;
        this.Id = setter.Id;
        this.InputName = setter.InputName;
        this.Src = setter.Src;
        this.Url = setter.Url;
        this.Style = setter.Style;
        this.ButtonStyle = setter.ButtonStyle;
        this.ImageStyle = setter.ImageStyle;
        this.DisplayUploadButton = setter.DisplayUploadButton;
        this.Root = setter.Root;
        this.spinnerTemplate = new Spin_Sphere().template;
        this.tag = this.create();
        this.Loader = this.tag.querySelector("div.ts-imageloader");
        this.spinner = this.tag.querySelector("div[spinner]");
        this.image = this.tag.querySelector("img");
        this.btn_load = this.tag.querySelector("button[upload]");
        this.btn_erase = this.tag.querySelector("button[erase]");
        this.Root.appendChild(this.tag);
        this.fileLoader = new FileLoader(this.Loader, false);
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
            let status ={
                id: this.Id,
                name: this.InputName,
                fileName: this.FileName,
                src :this.image.src
            };
            this.erased.next(status);

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
    private create = ():HTMLElement => {

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
        if(this.Autosave){
            removeLocal(`imageloader_${this.Id}_${this.InputName}`);
        }
        let status ={
            id: this.Id,
            name: this.InputName,
            fileName: this.FileName,
            src :this.image.src
        };
        this.erased.next(status);
    }

    setAutosave = (autosave:boolean)=>this.Autosave = autosave;


}
