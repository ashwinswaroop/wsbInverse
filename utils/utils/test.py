from google.cloud import dataproc_v1beta2
from time import sleep

clusterClient = dataproc_v1beta2.ClusterControllerClient()
jobClient = dataproc_v1beta2.JobControllerClient()

# T_odo: Initialize `project_id`:
project_id = 'PROJECT-ID'

# T_odo: Initialize `region`:
region = 'global'

# T_odo: Initialize `cluster`:
cluster = {
  "cluster_name": "CLUSTER-NAME",
  "config": {
    "config_bucket": "",
    "gce_cluster_config": {
      "zone_uri": "ZONE-URI",
      "metadata": {},
      "subnetwork_uri": "default"
    },
    "master_config": {
      "num_instances": 1,
      "machine_type_uri": "n1-standard-4",
      "disk_config": {
        "boot_disk_type": "pd-standard",
        "boot_disk_size_gb": 100,
        "num_local_ssds": 0
      }
    },
    "worker_config": {
      "num_instances": 2,
      "machine_type_uri": "n1-standard-4",
      "disk_config": {
        "boot_disk_type": "pd-standard",
        "boot_disk_size_gb": 100,
        "num_local_ssds": 0
      }
    },
    "software_config": {
      "image_version": "1.3-deb9",
      "properties": {}
    },
    "secondary_worker_config": {
      "num_instances": 0,
      "is_preemptible": 1
    }
  },
  "project_id": "PROJECT-ID"
}

job = {
    "reference": {
      "project_id": "PROJECT-ID",
      "job_id": "JOB-ID"
    },
    "placement": {
      "cluster_name": "CLUSTER-NAME",
      "cluster_uuid": "CLUSTER-UUID"
    },
    "submitted_by": "EMAIL",
    "job_uuid": "JOB_UUID",
    "spark_job": {
      "main_jar_file_uri": "gs://JARLOCATION/ON/GCP/STORAGE",
      "args": [
        "1514782800",
        "1546318800"
      ]
    }
}

#export GOOGLE_APPLICATION_CREDENTIALS="/PATH/TO/GCP/KEYS"
#virtualenv <your-env>
#source <your-env>/bin/activate
#<your-env>/bin/pip install google-cloud-dataproc
createResponse = clusterClient.create_cluster(project_id, region, cluster)
sleep(5)
submitResponse = jobClient.submit_job(project_id, region, job)
#createResponse.add_done_callback(createCallback)

# Handle metadata.
#metadata = response.metadata()
