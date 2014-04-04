package meres

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._
import io.gatling.http.Headers.Names._
import scala.concurrent.duration._
import bootstrap._
import assertions._

class WebformMeresSubmit1k extends Simulation with X {
	val scnn = "Submit1k"
	val query = 1
	val fSubmit = true

	setUp(scnCreate().inject(nothingFor(1 second), us : _*)).protocols(httpConf)
}
class WebformMeresSubmit10k extends Simulation with X {
	val scnn = "Submit10k"
	val query = 2
	val fSubmit = true

	setUp(scnCreate().inject(nothingFor(1 second), us : _*)).protocols(httpConf)
}
class WebformMeresSubmit100k extends Simulation with X {
	val scnn = "Submit100k"
	val query = 3
	val fSubmit = true

	setUp(scnCreate().inject(nothingFor(1 second), us : _*)).protocols(httpConf)
}

class WebformMeresQuery1k extends Simulation with X {
	val scnn = "Query1k"
	val query = 1
	val fSubmit = false

	setUp(scnCreate().inject(nothingFor(1 second), us : _*)).protocols(httpConf)
}
class WebformMeresQuery10k extends Simulation with X {
	val scnn = "Query10k"
	val query = 2
	val fSubmit = false

	setUp(scnCreate().inject(nothingFor(1 second), us : _*)).protocols(httpConf)
}
class WebformMeresQuery100k extends Simulation with X {
	val scnn = "Query100k"
	val query = 3
	val fSubmit = false

	setUp(scnCreate().inject(nothingFor(1 second), us : _*)).protocols(httpConf)
}

class WebformMeresDebug extends Simulation with X {
	val scnn = "DEBUG"
	val query = 3
	val fSubmit = true

//	lazy override val dUser = 1 minutes
//	lazy override val dFill = 2 * 5 seconds
//	lazy override val pDaq = 1 seconds
//	lazy override val pSubmit = 5 seconds
//	lazy override val dRamp = 5 minutes
//	lazy override val dRun = dUser + dRamp + (2 minutes)
	lazy override val us  =  List(ramp(1000 users) over(dRamp))

	setUp(scnCreate().inject(nothingFor(1 second), us : _*)).protocols(httpConf
//		.extraInfoExtractor( (status, session, request, response) => {
//			println("*** REQUEST *************************")
//			println(request.getHeaders)
//			println(request.getStringData)
//			println("*** RESPONSE ************************")
//			println(response.getHeaders)
//			println(response.getResponseBody)
//			println("*************************************")
//			Nil
//		})

	)
}

trait X {
	val httpConf = http
			.baseURL("http://webforms.measure.outdoor.mobilengine.com")
			.acceptHeader("*/*")
			.acceptEncodingHeader("gzip, deflate")
			.acceptLanguageHeader("en-US,en;q=0.5")
			.connection("keep-alive")
			.warmUp("http://webforms.measure.outdoor.mobilengine.com")
//			.userAgentHeader("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:28.0) Gecko/20100101 Firefox/28.0")
//			.requestInfoExtractor(request => {
//			    println(request.getHeaders)
//			    println(request.getStringData)
//			  Nil
//			})
//			.responseInfoExtractor(response => {
//			    println(response.getHeaders)
//			    println(response.getResponseBody)
//			    Nil
//			  });

	val patterns = csv("patterns.csv").circular;

	val scnn: String
	val query: Int
	val fSubmit: Boolean
	lazy val dUser: FiniteDuration = 20 minutes
	lazy val dFill: FiniteDuration = 2 * 48 seconds
	lazy val pDaq: FiniteDuration = 1 seconds
	lazy val pSubmit: FiniteDuration = dFill / 2
	lazy val dRamp: FiniteDuration = 5 minutes;
	lazy val dRun: FiniteDuration = dUser + dRamp + (2 minutes)
	lazy val us  =  List(
		ramp(10 users) over(dRamp), nothingFor(dRun),
		ramp(50 users) over(dRamp), nothingFor(dRun),
		ramp(100 users) over(dRamp), nothingFor(dRun),
		ramp(500 users) over(dRamp), nothingFor(dRun),
		ramp(1000 users) over(dRamp)
	)

	def scnCreate = () =>
	{

		scenario(scnn)
		.exec(session => session.set("query", query))
		.during(dUser, "iopen") {
			doIf(session => session("iopen").as[Int] == 0){
				exec(http("Login")
					.post("http://measure.outdoor.mobilengine.com/Presentation/login")
					.param("""returnurl""", """http://webforms.measure.outdoor.mobilengine.com:80/""")
					.param("""kproduct""", """Webforms""")
					.param("""username""", """gandalf""")
					.param("""password""", """wapaja.115""")
					.check(regex("""<a href="([/a-zA-Z0-9]+)">meresform</a>""").saveAs("formurl"))
				)
				.exitHereIfFailed
			}
			.exec(http("Open Form")
				.get("${formurl}")
				.check(regex( """wesid\: ([0-9]+)\,""").saveAs("wesid"))
				.check(regex( """idMetadata\: ([0-9]+)\,""").saveAs("idmeta"))
				.check(regex( """idAssignment\: ([0-9]+)\,""").saveAs("idass"))
				.check(regex( """guidRdt\: '([a-zA-Z0-9]+)'""").saveAs("guidrdt"))
				.check(headerRegex( """Set-Cookie""", """XSRF-TOKEN\=([0-9a-zA-Z]+);""").saveAs("xsrf"))
				.check(regex( """Daqev\.evaluate\('([0-9]+_${query})', \{[a-zA-Z0-9]+:""").saveAs("daqkey"))
				.check(regex( """Daqev\.evaluate\('[0-9]+_${query}', \{([a-zA-Z0-9]+):""").saveAs("parn"))
				.check(regex( """(a71[a-zA-Z0-9_]*)""").saveAs("subtitle"))
			)
			.exitHereIfFailed
			.feed(patterns)
			.during(dFill) {
				pause(pDaq*0.5, pDaq*1.5)
				.exec(http("Execute Daq")
					.post("/Webform/ExecuteDaq/")
					.headers(Map(
						"Accept" -> """text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8""",
						"Cache-Control" -> """no-cache""",
						"Content-Type" -> """application/json;charset=utf-8""",
						"Pragma" -> """no-cache""",
						"X-Requested-With" -> """XMLHttpRequest""",
						"X-XSRF-TOKEN" -> """${xsrf}"""
					))
					.body(StringBody("""{"Daqkey":"${daqkey}","MpprmByParn":{"${parn}":"%${pattern}"},"Wesid":${wesid}}"""))
				)
				.exitHereIfFailed
			}
			.exitHereIfFailed
			.doIf(fSubmit) {
				exec(http("Submit")
					.post("/Webform/submit")
					.headers(Map(
						"Accept" -> """application/json, text/plain, */*""",
						"Cache-Control" -> """no-cache""",
						"Content-Type" -> """application/json;charset=utf-8""",
						"Pragma" -> """no-cache""",
						"X-Requested-With" -> """XMLHttpRequest""",
						"X-XSRF-TOKEN" -> """${xsrf}"""
					))
					.body(StringBody("""{"Wesid":${wesid},"IdMetadata":${idmeta},"IdAssignment":${idass},"JsonWfdn":{"${subtitle}":"${query}"},"GuidRdt":"${guidrdt}"}"""))
				)
				.exitHereIfFailed
				.pause(pSubmit)
			}
			.exitHereIfFailed
		};
	};
}