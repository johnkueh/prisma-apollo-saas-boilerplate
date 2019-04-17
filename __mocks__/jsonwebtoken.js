const jsonwebtoken = jest.genMockFromModule('jsonwebtoken');

jsonwebtoken.sign = jest.fn().mockReturnValue('JWT_TOKEN_STRING');

export default jsonwebtoken;
