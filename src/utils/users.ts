export const filterUsers = (users: any[], filter: string) => {
    return users.filter(user => !user.fullName.search(filter));
}