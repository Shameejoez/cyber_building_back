
export const revokedToken = new Map()

export const revokeToken = (token: string, expIn: number) => {

    setTimeout(() => {
        revokedToken.delete(token)
        console.log(`Token ${token} автоматически удален из черного списка`);
    }, expIn * 1000)

    revokedToken.set(token, true)
    console.log(`Token ${token} добавлен в черный список на ${expIn} секунд`);
}

