import { useCookies } from "vue3-cookies";
import authServices from '@/services/auth.services';

const cookies = useCookies();

export default function checkLogin() {
    const tokenBearer = cookies.cookies.get('Token');
    if (tokenBearer == null || tokenBearer == '') return false;
    return true
}