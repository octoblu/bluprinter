#!/usr/bin/env bash
# account: sqrt+iot-app-bluprinter-examples
# TODO: create dev user, call dev api.octoblu

# 1 Create the original flow
# 2 Create IoT App
# 3 Configure your IoT App
# 4 Import bluprint -- https://bluprinter.octoblu.com/bluprints/:uuid/import
# 5 Configure IoT app
# 6 Download creds of the bluprint created by the IoT app
# 7 Use meshblu-util to subscribe to the bluprint
# 8 Use meshblu-util message to message the device


AUTHOR_UUID=90b3615a-3c43-430a-bd90-16f6b0ef3c6d
AUTHOR_TOKEN=d4c8f0998b0085df2265b3222ad32fcc686b6043

mkdir ./tmp

echo "creating flow"
AUTHOR_FLOW=$(curl -X POST https://api.octoblu.com/api/templates -H "X-MESHBLU-UUID: $AUTHOR_UUID" -H "X-MESHBLU-TOKEN: $AUTHOR_TOKEN")
# a33 - blank flow / iot app / running IoT App
# 9bd - trigger UUID
# meshblu-util message -d '{"devices":["a331dcfa-2402-4acf-a0de-a4191376a90c"], "metadata":{ "to": {"nodeId": "9bd37440-3352-11e6-82f0-693810c21e82"} }}'
