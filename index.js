
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({
      apikey: process.env.API_KEY,
    }),
    serviceUrl: process.env.URL_TEXT_ANALYZER,
  });

exports.handler = async (event, context, callback) => {

      const analyzeParams = {
        "text": event.historial_clinico,
        "features": {
          "entities": {
            'type': true,
            'sentiment': true,
            'relevance': true,
            'emotion': true,
            'count': true,
            'confidence': true,
            'limit': 5
          },
          "keywords": {
            'sentiment': true,
            'relevance': true,
            'count': true,
            'emotion': true,
            'limit': 5
          }
        }
      };

      try {
        const analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams);
         
        let resultado = analysisResults.result;
        let lenguaje = resultado.language;
  
        let palabras = resultado.keywords;
        let entidades = resultado.entities;
  
        //Limpiar palabras
        let palabrasArr = [];
  
        let palabras_clave_desc = {};
  
        palabras.forEach(element => {
          //LLenar el arrglo de palabras  
          palabrasArr.push(element.text);
  
          let sentimiento = "";
          if(element.sentiment.label){
            sentimiento = element.sentiment.label;
          }
          let relevancia = 0;
          if(element.relevance){
            relevancia = element.relevance;
          }
          let repeticiones = 0; 
          if(element.count){
            repeticiones = element.count;
          }
          let emocion = "";
          if(element.emotion){
            emocion = emocionMax(element.emotion);
          }
          let texto_palabra_clave = {
            "sentimiento": sentimiento,
            "relevancia": relevancia,
            "repeticiones": repeticiones,
            "emocion": emocion
          };
          palabras_clave_desc[element.text] = texto_palabra_clave;
            
        });

        //Limpiar palabras
        let entidadesArr = [];
        let entidades_desc = {};
  
        entidades.forEach(element => {
          //LLenar el arrglo de palabras  
          entidadesArr.push(element.text);
  
          let tipo = "";
          if(element.type){
            tipo = element.type;
          }
  
          let sentimiento = "";
          if(element.sentiment.label){
            sentimiento = element.sentiment.label;
          }
          let relevancia = 0;
          if(element.relevance){
            relevancia = element.relevance;
          }
          let repeticiones = 0; 
          if(element.count){
            repeticiones = element.count;
          }
          let emocion = "";
          if(element.emotion){
            emocion = emocionMax(element.emotion);
          }
  
          let confianza = 0;
          if(element.confidence){
            confianza = element.confidence;
          }
  
          let texto_de_entidad = {
            "tipo":tipo,
            "sentimiento": sentimiento,
            "relevancia": relevancia,
            "emocion": emocion,
            "repeticiones": repeticiones,
            "porcentaje_confianza": confianza
          };
          entidades_desc[element.text] = texto_de_entidad;
            
        });
  
          let body_de_salida = {
            "lenguaje_texto": lenguaje,
            "palabras_clave": palabrasArr,
            "entidades": entidadesArr,
            "palabras_clave_desc": palabras_clave_desc,
            "entidades_desc": entidades_desc
          };

          return body_de_salida;

      }catch(err){
        const response = {
            statusCode: 200,
            body: JSON.stringify(err),
            };
        return response;
      }
      
    function emocionMax(emocionObj){
        let arr = Object.values(emocionObj);
        let max = Math.max(...arr);
        return Object.keys(emocionObj).find(key => emocionObj[key] === max);
    }
      
      
}; // Fin exports handler
