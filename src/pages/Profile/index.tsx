import React, { ChangeEvent, useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { FiArrowLeft, FiMail, FiLock, FiUser, FiCamera } from 'react-icons/fi';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErros';
import { useAuth } from '../../contexts/auth';
import { useToast } from '../../contexts/toast';
import api from '../../services/api';

import Button from '../../components/Button';
import Input from '../../components/Input';
import { Container, Content, AvatarInput } from './styles';

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { user, updateUser } = useAuth();
  const history = useHistory();
  const { addToast } = useToast();

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        api.patch('/users/avatar', data).then((response) => {
          updateUser(response.data);
        });
      }
    },
    [updateUser]
  );

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .email('Digite um email válido')
            .required('Email obrigatório'),
          password: Yup.string(),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Senhas devem ser iguais'
          ),
          old_password: Yup.string().when('password', {
            is: (val) => !!val.lenght,
            then: Yup.string().required('Senha obrigatória'),
          }),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const formData = Object.assign(
          {
            name: data.name,
            email: data.email,
          },
          data.password
            ? {
                password: data.password,
                password_confirmation: data.password_confirmation,
                old_password: data.old_password,
              }
            : {}
        );

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        history.push('/dashboard');
        addToast({
          type: 'success',
          title: 'Atualização de perfil realizada',
          description:
            'Suas informações do perfil foram atualizadas com sucesso',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        }

        addToast({
          type: 'error',
          title: 'Erro no Atualização de perfil',
          description:
            'Ocorreu um erro ao realizar a atualização de perfil, verifique seus dados e tente novamente',
        });
      }
    },
    [addToast, history, updateUser]
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user?.name,
            email: user?.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user?.avatar_url} alt={user?.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu Perfil</h1>

          <Input name="name" icon={FiUser} type="text" placeholder="Nome" />
          <Input name="email" icon={FiMail} type="email" placeholder="E-mail" />

          <div className="space" />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova Senha"
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar nova senha"
          />
          <Input
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
