const expect = require('expect');

const {Users} = require('./users');


describe('Users', () => {

    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Node Course'
        }, {
            id: '2',
            name: 'Jen',
            room: 'React Course'
        }, {
            id: '3',
            name: 'Julie',
            room: 'Node Course'
        }];
    });

    it('should add new users', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'Marco',
            room: 'room'
        };
        var resUser = users.addUser(user.id, user.name, user.room);
        
        expect(users.users).toEqual([user]); //checks if users array in the users object is equal to user
    });

    it('should remove a user', () => {
        var userId = '1';
        var user = users.removeUser(userId);
        
        expect(user).toBeTruthy();
        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });
    
    it('should not remove a user', () => {
        var userId = '4';
        var user = users.removeUser(userId);
        
        expect(user).toBeFalsy();
    });

    it('should find user', () => {
        var userId = '1';
        var user = users.getUser(userId);
        
        expect(user.id).toBe(userId);
    });

    it('should not find user', () => {
        var userId = '4';
        var user = users.getUser(userId);

        expect(user).toBeFalsy();
    })

    it('should return names for node course', () => {
        var userList = users.getUserList('Node Course');

        expect(userList).toEqual(['Mike', 'Julie']);
    });

    it('should return names for react course', () => {
        var userList = users.getUserList('React Course');

        expect(userList).toEqual(['Jen']);
    });
});