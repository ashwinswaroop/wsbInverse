import org.apache.spark.sql._
import org.apache.spark.sql.functions._

object Consensus_TSLA {
  def main(args: Array[String]) {
    val spark = SparkSession.builder.appName("wsbInverse").getOrCreate()
    import spark.implicits._

    val df1 = spark.read.format("json").option("multiLine","true").load("gs://wsbinverse/data/wsb2.json").select("body","created_utc","id").withColumn("date",from_unixtime(col("created_utc"),"yyyy-MM-dd"))

    val df2 = df1.filter((lower($"body").contains("call") && lower($"body").contains("tsla")) || (lower($"body").contains("moon") && lower($"body").contains("tsla")) || (lower($"body").contains("green") && lower($"body").contains("tsla")) || (lower($"body").contains("bull") && lower($"body").contains("tsla")) || (lower($"body").contains("rise") && lower($"body").contains("tsla"))).groupBy(col("date")).agg(collect_list(col("id")) as "id").withColumn("bulls", size($"id")).select("date","bulls")

    val df3 = df1.filter((lower($"body").contains("put") && lower($"body").contains("tsla")) || (lower($"body").contains("drill") && lower($"body").contains("tsla")) || (lower($"body").contains("red") && lower($"body").contains("tsla")) || (lower($"body").contains("drop") && lower($"body").contains("tsla")) || (lower($"body").contains("rip") && lower($"body").contains("tsla"))).groupBy(col("date")).agg(collect_list(col("id")) as "id").withColumn("bears", size($"id")).select("date","bears")

    //val df3 = df1.filter(lower($"body").contains("put") || lower($"body").contains("drill") || lower($"body").contains("red") || lower($"body").contains("gang") || lower($"body").contains("recession") || lower($"body").contains("crash")).groupBy(col("date")).agg(collect_list(col("id")) as "id").withColumn("bears", size($"id")).select("date","bears")

    val df4 = df2.join(df3,"date").withColumn("score", $"bulls" - $"bears")

    val df5 = spark.read.format("csv").option("header", "true").load("gs://wsbinverse/data/tsla2.csv").select("date","close")

    //val df6 = df4.join(df5,"date").orderBy(asc("date")).write.json("gs://wsbinverse/data/result.json")

    val df6 = df4.join(df5,"date").orderBy(asc("date")).coalesce(1).write.format("json").save("gs://wsbinverse/data/result_tsla_2019")
    /*
    df1.createOrReplaceTempView("comments")

    val df2 = spark.read.format("csv").option("header", "true").load("gs://wsbinverse/data/snp.csv")
    df2.createOrReplaceTempView("stock")


    val df3 = spark.sql("select s.date, s.close, count(*) as count from comments c, stock s where c.date = s.date and lower(c.body) like '%bull%' or lower(c.body) like '%green%' or lower(c.body) like '%moon%' or lower(c.body) like '%up%' or lower(c.body) like '%gain%' or lower(c.body) like '%call%' or lower(c.body) like '%good%' or lower(c.body) like '%rise%' and c.created_utc > "+args(0)+" and c.created_utc < "+args(1)+" group by s.date, s.close order by s.date")

    val df3 = spark.sql("select s.date, s.close, count(*) as count from comments c, stock s where c.date = s.date and lower(c.body) like '%call%' or lower(c.body) like '%moon%' or lower(c.body) like '%green%' and c.created_utc > "+args(0)+" and c.created_utc < "+args(1)+" group by s.date, s.close order by s.date")
    df3.show()
    df3.createOrReplaceTempView("bull")



    val df4 = spark.sql("select s.date, s.close, count(*) as count from comments c, stock s where c.date = s.date and lower(c.body) like '%bear%' or lower(c.body) like '%red%' or lower(c.body) like '%gang%' or lower(c.body) like '%blood%' or lower(c.body) like '%drill%' or lower(c.body) like '%down%' or lower(c.body) regexp '[^\u0000-\uFFFF]' or lower(c.body) like '%fall%' or lower(c.body) like '%put%' and c.created_utc > "+args(0)+" and c.created_utc < "+args(1)+" group by s.date, s.close order by s.date")

    val df4 = spark.sql("select s.date, s.close, count(*) as count from comments c, stock s where c.date = s.date and lower(c.body) like '%put%' or lower(c.body) like '%drill%' or lower(c.body) like '%red%' and c.created_utc > "+args(0)+" and c.created_utc < "+args(1)+" group by s.date, s.close order by s.date")
    df4.show()
    df4.createOrReplaceTempView("bear")

    val df5 = spark.sql("select bull.date, bull.close, bull.count - bear.count as score from bull, bear where bull.date = bear.date and bull.close = bear.close order by bull.date")

    //df5.show()

    //df5.write.json("gs://wsbinverse/data/final.json")
    //df5.write.mode("append").json("gs://wsbinverse/data/final2.json")
    df5.coalesce(1).write.format("json").save("gs://wsbinverse/data/mongodb")
    */
    spark.stop()
    }
  }

  //1514782800
  //1519880400

//2018 to 2019
//1514782800
//1546318800
