import org.apache.spark.sql._
import org.apache.spark.sql.functions._

object Consensus {
  def sentiment(args: Array[String]) {
    val spark = SparkSession.builder.appName("wsbInverse").getOrCreate()
    import spark.implicits._

    val df1 = spark.read.format("json").option("multiLine","true").load("gs://wsbinverse/data/wsb2.json").select("body","created_utc","id").withColumn("date",from_unixtime(col("created_utc"),"yyyy-MM-dd"))

    val df2 = df1.filter($"body".contains("call") || $"body".contains("moon") || $"body".contains("green") || $"body".contains("bull") || $"body".contains("rally")).groupBy(col("date")).agg(collect_list(col("id")) as "id").withColumn("bulls", size($"id")).select("date","bulls")

    val df3 = df1.filter($"body".contains("put") || $"body".contains("drill") || $"body".contains("red") || $"body".contains("gang") || $"body".contains("recession") || $"body".contains("crash")).groupBy(col("date")).agg(collect_list(col("id")) as "id").withColumn("bears", size($"id")).select("date","bears")

    val df4 = df2.join(df3,"date").withColumn("score", $"bulls" - $"bears")

    val df5 = spark.read.format("csv").option("header", "true").load("gs://wsbinverse/data/snp2.csv").select("date","close")

    val df6 = df4.join(df5,"date").orderBy(asc("date")).coalesce(1).write.format("json").save("gs://wsbinverse/data/result_2019")

    spark.stop()
    }
  }
