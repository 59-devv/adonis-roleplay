import test from 'japa'
import supertest from 'supertest'
import { UserFactory } from '../../database/factories/index'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', () => {
  test('it should create an user', async (assert) => {
    const userPayload = {
      email: 'test@test.com',
      username: 'test',
      password: 'test',
      avatar: 'https://images.com/images/1',
    }
    const { body } = await supertest(BASE_URL).post('/users').send(userPayload).expect(201)

    assert.exists(body.user, 'User undefined.')
    assert.exists(body.user.id, 'Id undefined.')
    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.username, userPayload.username)
    assert.equal(body.user.avatar, userPayload.avatar)
    assert.notExists(body.user.password, 'Password defined.')
  })

  test('it should return 409 when email is already in use', async (assert) => {
    const { email } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email,
        username: 'test',
        password: 'test',
      })
      .expect(409)
  })
})
