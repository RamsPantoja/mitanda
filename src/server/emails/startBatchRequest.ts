type InitBatchEmailProps = {
    batchName: string
    link: string
}

const startBatchRequestEmail = ({ batchName, link }: InitBatchEmailProps) => {
    return (
        `
        <!DOCTYPE html>
<html 4mail>

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solicitud para iniciar tanda</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
</head>

<body style="margin: 0;padding: 40px;font-family: 'Inter', sans-serif;">
  <div class="email_template__content"
    style="border: 2px solid #B3B3B3; border-radius: 10px; max-width: 624px; min-width: 624px; margin: 0 auto;text-align: left;text-align: center;position: relative;">
    <div class="email_template__header"
      style="padding: 30px;border-radius: 8px 8px 0 0; display: block;margin: 0;position: relative;background-color: #181818;">
      <div class="horizontal__center_img" style="text-align: center; display: inline-block;">
        <img class="paddind_img"
          src="https://firebasestorage.googleapis.com/v0/b/mitanda.appspot.com/o/assets%2Fmitanda-isotipo.png?alt=media&token=a5df715a-5c8a-4dcb-a64a-5198ee1fd050"
          width="50px" height="auto" alt="isotipo r3d" style="padding: 0 1em;">
        <p style="color: #ffffff; margin: 0;font-weight: 600; font-size: 20px;">Mitanda</p>
      </div>
    </div>
    <div style="border-radius: 0 0 8px 8px; margin: 0 auto;text-align: left;background-color: #000000;padding: 30px;">
      <h1 style="color:#ffffff; text-align: center;">¡Atención!</h1>
      <p style="color:#B3B3B3;">Se ha creado una solicitud para iniciar la tanda: <b>${batchName}</b></p>
      <p style="color:#B3B3B3;">Para que todo funcione sin problemas, te solicitamos:</p>
      <ul style="color:#B3B3B3;">
        <li style="margin-bottom: 10px;"><b>Confirmar tu participación:</b> Si aún no lo has hecho, por favor confirma
          tu participación en la tanda
          lo antes posible.</li>
        <li style="margin-bottom: 10px;"><b>Configurar tus datos bancarios:</b> Para facilitar el proceso de
          transferencias, te pedimos que
          configures tus datos bancarios en la plataforma.</li>
      </ul>
      <a
        href="${link}"
        style="display: inline-block; color: #000000; background-color: #1ed760; padding: 14px; border-radius: 5px; font-weight: 600; margin: 20px 0 20px 0;">Confirmar
        participación</a>
      <p style="color:#B3B3B3;">Cualquier duda o comentario que tengas, no dudes en contactarnos.</p>
      <p style="color:#B3B3B3;">¡Muchas gracias por tu colaboración!</p>
    </div>
  </div>
  </div>
</body>

</html>
        `
    )
}

export default startBatchRequestEmail;