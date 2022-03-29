import { LangInfoItem } from '@thestarweb/trove-lang-tool';

export interface OpendFile {
    name:string,
    srcFile:File,
    loaded:boolean,
    data?:LangInfoItem[],
    savedData?:LangInfoItem[],
    changeHistory:{
        type: 'add'|'delete'|'change'
        oldData?:LangInfoItem,
    }[],
    hasNoSaveChange: boolean,
}