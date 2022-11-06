import Image from 'next/image';
import app_preview_img from '../assets/app-nlw-copa-preview.png'
import logo_img from '../assets/logo.svg'
import users_avatar_example_img from '../assets/users-avatar-example.png'
import icon_check_img from '../assets/icon-check.svg'
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';

interface HomeProps {
  pool_count: number,
  guess_count: number,
  user_count: number,
}

export default function Home(props: HomeProps) {
  const [pool_title, set_pool_title] = useState('')

  async function create_pool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('/pools', {
        title: pool_title
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      set_pool_title('');

      alert('Bolão criado com sucesso, o código copiado para a área de transferência!');
    } catch (err) {
      console.log(err);
      alert('Falha ao criar o bolão, tente novamente.');
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logo_img} alt="Logo da NLW Copa" />
        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={users_avatar_example_img} alt="avatares dos usuários" />

          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.user_count}</span> pessoas já estão usando
          </strong>
        </div>

        <form className='mt-10 flex gap-2' onSubmit={create_pool}>
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type="text"
            required
            placeholder='Qual o nome do seu bolão?'
            onChange={event => set_pool_title(event.target.value)}
            value={pool_title}
          />
          <button
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={icon_check_img} alt="Ícone de check" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.pool_count}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-10 bg-gray-600' />

          <div className='flex items-center gap-6'>
            <Image src={icon_check_img} alt="Ícone de check" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guess_count}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={app_preview_img}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [pool_count_response, guesses_count_response, users_count_response] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count'),
  ]);

  return {
    props: {
      pool_count: pool_count_response.data.count,
      guess_count: guesses_count_response.data.count,
      user_count: users_count_response.data.count,
    }
  }
}
