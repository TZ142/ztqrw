
import Http from '../http';

//重置连接设置
export const Refreshhttp = function() {
    Http.RefreshUrl()
}
export const AgvGet = function(type) {
    var obj=new Object();
   obj.type=type;
    return Http.get('/webclient',obj)
}
export const AgvPost = function(type,formdata)
{
    console.log(formdata)
    var strUrl='/webclient?type='+type.toString();
   return Http.post(strUrl,formdata)
}