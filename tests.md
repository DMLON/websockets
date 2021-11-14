# Test results

Los tests devolvieron que hacer el console.log determina que el tiempo de respuesta es mayor, algo que es al reves de como uno pensaria.
Me resulta extraño que hacer el console.log decremente la cantidad de respuestas posibles por segundo, así como reducir el tiempo entre respuestas.
Esto al menos visto desde artillery

Visto desde autocannon se puede ver que el hecho de tener el console.log incremento la latencia.

Otro detalle visto desde autocannon es que tener el prof a diferencia del 0x está menos optimizado, se puede ver que en ambos casos, tanto con o sin consola, el prof tiene mayor latencia.


El inspect no lo logré hacer funcionar, el chrome no me muestra los procesos de Javascript.



