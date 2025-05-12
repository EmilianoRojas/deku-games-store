import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';

const getBaseFaqItems = () => [
  {
    question: '¿CÓMO FUNCIONA?',
    answer: (
      <>
        <p>¡Descubre nuestro exclusivo sistema de cuentas para Switch! 🎮</p>
        <p>Adquiere tus juegos favoritos de manera rápida y económica 🌟.</p>
        <ol className="list-decimal list-inside mt-4">
          <li>Navega en nuestro catálogo y elige el pack de juegos que más te guste 🕹</li>
          <li>Confirma tu compra ✅ y accede a tu nueva cuenta para activar los juegos en tu consola 🎉</li>
        </ol>
        <p className="mt-4">¡Así de simple! 😎🔝</p>
      </>
    )
  },
  {
    question: '¿LOS JUEGOS SON ORIGINALES? 🕹',
    answer: (
      <>
        <p>¡Así es! 🌟</p>
        <p>Puedes descargar los juegos directamente desde los servidores oficiales de Nintendo 🛒, asegurándote de que no hay ningún riesgo de baneo 🚫 y sin necesidad de chipear tu consola 🔒😊.</p>
      </>
    )
  },
  {
    question: '¿CUÁNTO TIEMPO SE TARDA EN VINCULAR LA CUENTA? ⏳',
    answer: <p>¡En menos de 15 minutos tendrás la cuenta en tu consola!⚡️</p>
  },
  {
    question: '¿TIENEN REFERENCIAS DE CLIENTES? 🌟',
    answer: (
      <>
        <p>¡Por supuesto! 💯</p>
        <p>Hemos construido una vibrante comunidad de entusiastas, respaldada por una sólida base de clientes satisfechos que confían y certifican nuestra calidad. 🙌🏻</p>
        <p>No te quedes con las ganas, echa un vistazo a todas las referencias de nuestros clientes en este link</p>
      </>
    )
  },
  {
    question: '🌍 ¿EN QUÉ PAÍS PUEDO COMPRAR? 🌍',
    answer: (
      <>
        <p>Puedes comprar desde:</p>
        <ul className="list-disc list-inside mt-4">
          <li>Chile 🇨🇱</li>
          <li>Colombia 🇨🇴</li>
          <li>Argentina 🇦🇷</li>
          <li>Venezuela 🇻🇪</li>
          <li>Estados Unidos 🇺🇸</li>
        </ul>
        <p className="mt-4">📦 Tomamos todos nuestros pedidos de manera online 🖥. ¡Mantente atento! 🚀</p>
      </>
    )
  },
  {
    question: 'Términos y Condiciones de Garantía',
    answer: (
      <>
        <p>Asegúrate de contar con WiFi y suficiente espacio en la memoria para descargar los juegos.</p>
        <ol className="list-decimal list-inside mt-4 space-y-2">
          <li>No eliminar la cuenta comprada</li>
          <li>Jugar con su usuario personal</li>
          <li>No cancelar las descargas manualmente</li>
          <li>No intentar cambiar información de la cuenta</li>
          <li>Si usted juega en la cuenta adquirida corre riesgo de dañar todos los juegos y pierde la garantía de manera inmediata</li>
          <li>Descargue todos los juegos de una vez, no intente jugar antes de descargar todos los juegos</li>
          <li>No intente borrar un juego para descargarlo después</li>
          <li>No se hacen transferencias de cuentas entre consolas</li>
          <li>No descargue otro juego que no esté en la lista del pack que adquirió</li>
        </ol>
      </>
    )
  },
  {
    question: '⚠️ Importante: Actualización de Nintendo ⚠️',
    answer: (
      <>
        <p>Estimado/a cliente,</p>
        <p className="mt-4">Queremos informarte sobre una situación reciente relacionada con la actualización 20.0 de Nintendo, tanto en sus servidores como en las consolas. Debido a esta actualización, te recomendamos desconectar temporalmente tu consola de internet y disfrutar de tus juegos únicamente sin conexión.</p>
        <p className="mt-4">Esta medida preventiva tiene como objetivo evitar cualquier posible inconveniente con el enlace a tus juegos hasta que podamos ofrecerte una solución definitiva.</p>
        <p className="mt-4">Estamos trabajando diligentemente para encontrar una solución lo antes posible y te mantendremos informado sobre cualquier novedad.</p>
        <p className="mt-4">Agradecemos de antemano tu comprensión y paciencia ante esta situación. No dudes en contactarnos si tienes alguna pregunta.</p>
        <p className="mt-4">Atentamente,<br />Equipo @DekuGames</p>
      </>
    )
  }
];

const FAQ = () => {
  const { country } = useCurrency();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const paymentMethodsAnswer = (
    <>
      <p>Contamos con las siguientes formas de pago:</p>
      <div className="space-y-4">
      <div className="divider"></div>
      <div>
          {country == 'CL' && (
            <p className="font-semibold">📌 MercadoPago</p>
          )}
          <div className="divider"></div>
        </div>
        <div>
          <p className="font-semibold">📌 Transferencia Bancaria</p>
        </div>
        <div>
          {country !== 'CL' && (
            <p className="font-semibold">📌 Pago Movil (Promedio)</p>
          )}
          <div className="divider"></div>
        </div>
        <div>
          <p className="font-semibold">📌 Crypto (USDT)</p>
        </div>
          <div className="divider"></div>
      </div>
    </>
  );

  const faqItems = [
    ...getBaseFaqItems(),
    {
      question: '💳 Nuestros Métodos de Pago 💳',
      answer: paymentMethodsAnswer
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Preguntas Frecuentes
      </h1>
      
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={index} className="collapse collapse-arrow bg-base-200">
            <input 
              type="radio" 
              name="faq-accordion" 
              checked={openIndex === index}
              onChange={() => toggleAccordion(index)}
            />
            <div className="collapse-title text-xl font-medium">
              {item.question}
            </div>
            <div className="collapse-content">
              {item.answer}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          ¿Tienes preguntas? Contacta a nuestro equipo de soporte en{' '}
          <a 
            href="mailto:soporte@dekugames.com"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            soporte@dekugames.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default FAQ; 