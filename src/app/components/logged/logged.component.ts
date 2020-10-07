import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styles: []
})
export class LoggedComponent implements OnInit {

  //GENERALES
  arrayFraseDia = [];
  numero: number;
  frase: string;
  autor: string;

  constructor() { }

  ngOnInit(): void {
    this.frasedeldia();
  }

  frasedeldia() {
    this.arrayFraseDia = [
      "Ni yo estoy en el mundo para cumplir tus expectativas ni tú estás en el mundo para cumplir las mías. Bruce Lee",
      "El pesimista se queja del viento; el optimista espera que cambie; el realista ajusta las velas. Willian Arthur Ward",
      "Pedir perdón es de inteligentes, perdonar es de nobles pero perdonarse es de sabios.",
      "La reflexión es el camino hacia la inmortalidad. Buddha",
      "Nunca podrás plantar un buen futuro si estás anclado en el pasado. Edmund Burke",
      "La única forma de seguir adelante, es vivir el presente y esperar con alegría el futuro.",
      "No vas a encontrar una vida que valga la pena vivir, tienes que construirla tú mismo. Winston Churchill",
      "La vida es una sucesión de lecciones que uno debe vivir para entender. Ralph Waldo Emerson",
      "La gente nunca aprende nada que se les dice; deben averiguarlo ellos mismos. Paulo Coelho",
      "Un día de preocupación en la vida es mucho más agotador que una semana de trabajo. John Lubbock",
      "El tiempo perdido nunca se vuelve a encontrar. Benjamin Franklin",
      "Si te tomas la vida demasiado enserio, nunca vas a salir vivo de ella. Elbert Hubbard",
      "El mejor espejo de la vida es un viejo amigo. George Herbert",
      "La diferencia entre el fracaso y el éxito reside en la voluntad del corazón. Lolly Daskal",
      "Pensar es una dura labor que pocas personas realizan. Henry Ford",
      "Un hombre que no se alimenta de sus sueños es un hombre que envejece pronto. William Shakespeare",
      "No hay vida más completa que aquella que puedes vivir por elección propia. ",
      "La vida es 10% lo que nos sucede y 90% como reaccionamos.",
      "Lo que cuenta no son los años en nuestra vida, sino la vida en nuestros años. Abraham Lincoln",
      "La calidad de la vida de una persona es directamente proporcional a su compromiso con la excelencia. No importa a qué se dedique.",
      "¿Crees que soy sabio? No, simplemente aprendí a pensar. Christopher Paolini",
      "El que salta al vacío no le debe ninguna explicación a los que se paran a ver. Jean-Luc Godard",
      "El único realista de verdad es el visionario. Federico Fellini",
      "El misterio es el elemento esencial de cualquier obra de arte. Luis Buñuel",
      "No importa lo lejos que vayas, siempre y cuando no te detengas. Confucio",
      "No estoy de acuerdo con lo que dices, pero defenderé con mi vida tu derecho a expresarlo. Evelyn Beatrice Hall",
      "Puede que no estemos de acuerdo con los demás, pero tenemos que respetar sus opiniones como queremos que las nuestras sean respetadas.",
      "Solo existe un bien: el conocimiento - Solo existe un mal: la ignorancia. Sócrates",
      "El lujo no es más que la pobreza artificial. Sócrates",
      "Los ejemplos corrigen mejor que las reprimendas. Voltaire",
      "No basta con tener buen ingenio, lo principal es aplicarlo bien. Descartes",
      "No es que tengamos poco tiempo, es que perdemos mucho tiempo. Séneca",
      "La libertad consiste en ser dueños de nuestra propia vida. Platón",
      "La pureza del corazón consiste en desear una cosa. Søren Kierkegaard",
      "Como todo soñador, confundí la decepción con la verdad. Jean-Paul Sartre",
      "Pueden haber más bellos tiempos, pero éste es el nuestro. Jean-Paul Sartre",
      "La vida tiene valor siempre que se valore la vida de los otros, a través del amor, la amistad, la indignación y la compasión. Simone de Beauvoir",
      "No camines delante de mí, puede que no te siga - No camines detrás de mí, puede que no te guíe. Camina junto a mí y sé mi amigo. Albert Camus",
      "El perdón es la llave a la acción y libertad. Hannah Arendt",
      "Vemos las cosas no como son, sino como somos nosotros. Immanuel Kant",
      "Trata a las personas como un fin, nunca como un medio para un fin. Immanuel Kant",
      "La historia no es ni hace nada - Quien es y hace es el hombre. Karl Marx",
      "Prestar atención - Ese es nuestro más eterno trabajo y compromiso. Mary Oliver",
      "La vida es lo que pasa mientras estas ocupado haciendo otros planes. John Lennon",
      "La vida es realmente simple, pero insistimos en complicarla. Confucio",
      "Donde hay educación no hay distinción de clases. Confucio",
      "El sabio no dice lo que sabe, y el necio no sabe lo que dice. Proverbio Chino",
      "El pensamiento creativo inspira nuevas ideas y las nuevas ideas inspiran al cambio. Barbara Januszkiewicz",
      "Si parezco confundido, es porque estoy pensando. Samuel Goldwyn",
      "Piensa antes de hablar y lee antes de pensar. Fran Lebowitz",
      "Juzga a un hombre por sus preguntas, no por sus respuestas. Voltaire",
      "Brilla - Al que le moleste, puede taparse los ojos.",
      "Concentrarse en lograr un pequeño cambio es cambiar un día por completo.",
      "Tu mejor maestro es tu último error. Ralph Nader",
      "Observa tus defectos y conocerás tus virtudes. Confucio",
      "En la vida, nada funcionará hasta que tú no lo hagas. Maya Angelou",
      "La mejor vida no es la más duradera, sino la que está repleta de buenas acciones. Marie Curie",
      "El 10 % de mis logros son por mis capacidades, el 90 % por el duro trabajo.",
      "Si quieres darlo todo en esta vida, piensa en positivo.",
      "Siempre es temprano para rendirse. Norma Vincent Peale",
      "No pierdas tiempo con lo que no merece la pena, focalízate en lo realmente importante.",
      "Tener éxito no es aleatorio, es una variable dependiente del esfuerzo. Sófocles",
      "Es imposible disfrutar de vivencias positivas con una mentalidad negativa.",
      "El ser humano debe superar los obstáculos más difíciles para saborear el lado más dulce del éxito.",
      "Por mucho que fracases, cualquier hombre deberá triunfar en algún momento de su vida.",
      "Cáete siete veces y levántate ocho.",
      "El verdadero fracaso de una persona no es el hecho de fracasar en sí, sino el de no volver a intentarlo.",
      "Un buen líder no manda, pero sí enseña, inspira y muestra el camino correcto.",
      "Recuerda que la vida son dos días, así que intenta exprimirla al máximo y vivirla estando siempre presente.",
      "La diferencia entre un trabajador y un líder es el coraje y la innovación.",
      "No dejes que las expectativas de los que tienes a tu alrededor aplasten tus sueños.",
      "¿Qué hubiera pasado si no lo hubiera intentado?. Valentino Rossi",
      "Cuando pierdas, no pierdas la lección. Dalai Lama",
      "La mejor forma de ser positivo es estar con personas positivas.",
      "Los humanos somos entidades infinitas gracias a nuestra imaginación.",
      "Solo seremos niños una vez en la vida. Sin embargo, siempre podremos disfrutar de la inmadurez.",
      "No puedes derrotar a la persona que nunca se rinde. Babe Ruth",
      "No te pases el día buscando errores, lo que debes hacer es encontrar la solución.",
      "Si aprendes a sobrellevar el dolor, algún día serás más fuerte.",
      "Cae todas las veces que necesites, pero nunca dejes de levantarte.",
      "Sin exámenes, vivir tiene menos emoción.",
      "Ser positivo de mente es más milagroso que cualquier droga que pueda existir.",
      "El éxito tiene una simple fórmula: da lo mejor de ti y puede que a la gente le guste.",
      "Una idea se puede considerar como una ilusión hasta que dicha idea se convierte en realidad. Mark Twain",
      "La preparación es importante para el éxito, pero no puedes estar toda la vida preparándote.",
      "Recuerda que no puedes fallar en ser tú mismo. Wayne Dyer",
      "Del mismo modo que entrenamos el cuerpo para ser más fuertes, hay que hacerlo con el cerebro para ser más optimistas.",
      "Y ya que nos toca pensar..., ¿por qué no hacerlo a lo grande?",
      "Antes que nada, la preparación es la llave del éxito. Alexander Graham Bell",
      "Las ideas no son nada sin acción. ¿A qué esperas?",
      "Lo que no te mata, te hace más fuerte. Friedrich Nietzsche",
      "La parte más fuerte de una persona es su alma, donde se encuentran el amor y la perseverancia.",
      "Tú mismo eres el dueño de tu vida. Nadie más puede decirte lo que debes hacer.",
      "La clave del éxito se encuentra en creer de verdad en tu proyecto.",
      "La reputación no surge de lo que tienes pensado hacer. Henry Ford",
      "Apunta a la luna. Si fallas, podrías dar a una estrella. William Clement Stone",
      "Pon tus objetivos en lo más alto, donde no se puedan ver, y no pares hasta llegar a ellos.",
      "Solo tendrás éxito si crees que puedes tenerlo.",
      "Si piensas que puedes, podrás.",
      "Sé cordial con las personas, pero duro contigo mismo.",
      "Hasta el tronco más grande surge de la semilla más pequeña.",
      "Merece lo que deseas.",
      "La llave del éxito se encuentra en la pasión por lo que haces. Cuando te convenzas de ello, la tendrás en tus manos.",
      "Solo alcanzarás tus metas cuando creas en ti mismo.",
      "Las personas más exitosas no tienen miles de ideas, tienen pocas pero saben ponerlas en marcha.",
      "Escoge un trabajo que te guste, y nunca tendrás que trabajar ni un solo día de tu vida. Confucio",
      "Si te caíste ayer, levántate hoy.",
      "Eres lo que haces, no lo que dices que harás.",
      "Al final, todos somos el resultado de las decisiones que tomamos... así que asegúrate de tomarlas con la cabeza y de revisarlas con el corazón.",
      "Las mejores cosas de la vida llegan cuando te atreves a salir de tu zona de confort.",
      "Si no hay acción no hay cambio, si no hay reto no hay meta y si no hay pasión no hay ganas.",
      "No te rindas solo por haber tenido un mal día; perdónate y hazlo mejor mañana.",
      "Recuerda que una vez soñaste con llegar al sitio en el que te encuentras hoy.",
      "Si te centras en lo bueno, lo bueno puede llegar a ser incluso mejor.",
      "Siempre parece imposible... hasta que se hace. Nelson Mandela",
      "Es un proceso lento, pero abandonar no hará que llegues más rápido a la meta.",
      "La clave del éxito está en empezar antes de sentirte completamente preparado.",
      "Cuando haces lo correcto, obtienes la sensación de paz y serenidad; hazlo una y otra vez. Roy T Bennett",
      "Debes hacer las cosas que crees que no puedes hacer. Eleanor Roosevelt",
      "Si puedes soñarlo puedes hacerlo, recuerda que todo esto comenzó con un ratón. Walt Disney",
      "Si dominamos nuestra mente, vendrá la felicidad. Dalai Lama",
      "Cáete siete veces y levántate ocho. Proverbio japonés",
      "Todo lo que puedas imaginar, es real. Pablo Picasso",
      "La esperanza es el sueño del hombre despierto. Aristóteles",
      "Un objetivo sin un plan es solo un deseo. Antoine de Saint-Exupéry",
      "Si no te gustan las cosas, ¡cámbialas! No eres un árbol. Jim Rohn",
      "Para tener éxito, primero debemos creer que podemos hacerlo. Nikos Kazantzakis",
      "El fracaso es éxito si aprendemos de él. Malcolm Forbes",
      "El poder de la imaginación nos hace infinitos. John Muir",
      "El mejor momento del día es ahora. Pierre Bonnard",
      "No cuentes los días, haz que los días cuenten. Muhammad Ali",
      "Siempre es temprano para rendirse. Norman Vincent Peale",
      "El aprendizaje es un regalo. Incluso cuando el dolor es tu maestro. Maya Watson",
      "Haz una cosa que te de miedo al día. Eleanor Roosevelt",
      "Nunca eres demasiado viejo para tener otra meta u otro sueño. CS Lewis",
      "Encuentra algo que te apasione y mantente tremendamente interesado en ello. Julia Child"
    ];

    var numero = Math.random();
    numero = numero * this.arrayFraseDia.length;
    numero = numero * .5;
    numero = Math.round(numero);

    console.log("entro");

    let arreglo = this.arrayFraseDia[numero].split(".");
    this.frase = arreglo[0]
    this.autor = arreglo[1]
  }

}